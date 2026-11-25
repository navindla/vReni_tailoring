import React, {useRef, useState} from 'react';

import {Alert, ActivityIndicator, View, Text, Modal} from 'react-native';

import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

import {Service} from './Vreni/src/types/Service';
import {CheckoutBill, Order} from './Vreni/src/types/Order';

import ServicesScreen from './Vreni/src/screens/ServicesScreen';
import BillScreen from './Vreni/src/screens/BillScreen';
import CheckoutScreen from './Vreni/src/screens/CheckoutScreen';
import PaymentQrScreen from './Vreni/src/screens/PaymentQrScreen';
import HistoryScreen from './Vreni/src/screens/HistoryScreen';

import {useOrderHistory} from './Vreni/src/hooks/useOrderHistory';

type Screen = 'services' | 'bill' | 'checkout' | 'payment' | 'history';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('services');

  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  const [checkoutBill, setCheckoutBill] = useState<CheckoutBill | null>(null);

  const [isOpeningBill, setIsOpeningBill] = useState(false);
  const [hasOpenedBill, setHasOpenedBill] = useState(false);

  // New: Home screen history popup visibility
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [resumedOrderId, setResumedOrderId] = useState<string | null>(null);

  const openingBillRef = useRef(false);
  const savingForLaterRef = useRef(false);
  const savedForLaterBillRef = useRef<CheckoutBill | null>(null);
  const confirmingPaymentRef = useRef(false);

  const {orders, isLoading, isSaving, saveOrder, updateOrderPaymentStatus} =
    useOrderHistory();

  const clearCheckoutState = () => {
    setCheckoutBill(null);
    setSelectedServices([]);
    setHasOpenedBill(false);
    setIsOpeningBill(false);
    openingBillRef.current = false;
    setShowHistoryModal(false);
  };

  // Open Total Bill after 500 ms
  const handleConfirmServices = (items: Service[]) => {
    if (openingBillRef.current) return;

    openingBillRef.current = true;

    setSelectedServices(items);
    setHasOpenedBill(true);
    setIsOpeningBill(true);

    setTimeout(() => {
      setCurrentScreen('bill');
      setIsOpeningBill(false);
      openingBillRef.current = false;
    }, 500);
  };

  // Open Checkout
  const handleCheckout = (bill: CheckoutBill) => {
    setResumedOrderId(null);
    setCheckoutBill(bill);
    setCurrentScreen('checkout');
  };

  // Open Payment QR
  const handleProceedToPayment = () => {
    if (!checkoutBill) {
      Alert.alert('Error', 'Checkout details are missing.');
      return;
    }

    setCurrentScreen('payment');
  };

  // Step 2: connected to the checkout UI in the next increment.
  const handleSaveForLater = async () => {
    if (
      !checkoutBill ||
      isSaving ||
      savingForLaterRef.current ||
      savedForLaterBillRef.current === checkoutBill ||
      resumedOrderId !== null
    )
      return;

    const bill = checkoutBill;
    savingForLaterRef.current = true;
    try {
      const success = await saveOrder(bill, 'PENDING_PAYMENT');
      if (!success) throw new Error('Order persistence failed');

      savedForLaterBillRef.current = bill;
      clearCheckoutState();
      setCurrentScreen('history');
      Alert.alert(
        'Success',
        'Order saved for later. Payment is still pending.',
      );
    } catch {
      Alert.alert('Error', 'Unable to save order. Please try again.');
    } finally {
      savingForLaterRef.current = false;
    }
  };

  const handleResumePendingOrder = (order: Order) => {
    if (order.paymentStatus !== 'PENDING_PAYMENT') {
      Alert.alert('Error', 'Only pending orders can be resumed.');
      return;
    }

    const bill: CheckoutBill = {
      customerName: order.customerName,
      phoneNumber: order.phoneNumber,
      items: order.items.map(item => ({...item})),
      totalAmount: order.totalAmount,
    };

    setResumedOrderId(order.id);
    setCheckoutBill(bill);
    setSelectedServices([]);
    setHasOpenedBill(false);
    setIsOpeningBill(false);
    openingBillRef.current = false;
    setShowHistoryModal(false);
    setCurrentScreen('checkout');
  };

  const handleResumedCheckoutBack = () => {
    setResumedOrderId(null);
    setCheckoutBill(null);
    setCurrentScreen('history');
  };

  // Confirm payment manually and save order
  const handlePaymentConfirmed = async () => {
    if (!checkoutBill || isSaving || confirmingPaymentRef.current) {
      return;
    }

    confirmingPaymentRef.current = true;

    try {
      const success = resumedOrderId
        ? await updateOrderPaymentStatus(resumedOrderId)
        : await saveOrder(checkoutBill, 'PAYMENT_CONFIRMED');

      if (success) {
        clearCheckoutState();
        setResumedOrderId(null);
        setCurrentScreen('history');

        Alert.alert('Success', 'Payment confirmed and order saved.');
      } else {
        Alert.alert('Error', 'Unable to save order. Please try again.');
      }
    } finally {
      confirmingPaymentRef.current = false;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}
        edges={['top', 'bottom']}>
        {/* Services Screen */}
        {currentScreen === 'services' && (
          <ServicesScreen
            onConfirm={handleConfirmServices}
            onViewHistory={() => setShowHistoryModal(true)}
          />
        )}

        {/* Keep BillScreen mounted while Checkout is open */}
        {hasOpenedBill && (
          <View
            style={{
              flex: 1,
              display: currentScreen === 'bill' ? 'flex' : 'none',
            }}>
            <BillScreen
              services={selectedServices}
              isVisible={currentScreen === 'bill'}
              onBack={() => {
                setCurrentScreen('services');
                setHasOpenedBill(false);
              }}
              onCheckout={handleCheckout}
            />
          </View>
        )}

        {/* Checkout Screen */}
        {currentScreen === 'checkout' && checkoutBill && (
          <CheckoutScreen
            bill={checkoutBill}
            onBack={
              resumedOrderId
                ? handleResumedCheckoutBack
                : () => setCurrentScreen('bill')
            }
            onProceedToPayment={handleProceedToPayment}
            onSaveForLater={resumedOrderId ? undefined : handleSaveForLater}
            isSaving={isSaving}
          />
        )}

        {/* Payment QR Screen */}
        {currentScreen === 'payment' && checkoutBill && (
          <PaymentQrScreen
            amount={checkoutBill.totalAmount}
            isSaving={isSaving}
            onBack={() => setCurrentScreen('checkout')}
            onPaymentConfirmed={handlePaymentConfirmed}
          />
        )}

        {/* Full History Screen after successful payment */}
        {currentScreen === 'history' && (
          <HistoryScreen
            orders={orders}
            isLoading={isLoading}
            onBack={() => setCurrentScreen('services')}
            onProceedToCheckout={handleResumePendingOrder}
          />
        )}

        {/* New: Home Screen History Popup */}
        <Modal
          visible={showHistoryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowHistoryModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.55)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 12,
            }}>
            <View
              style={{
                width: '100%',
                height: '85%',
                backgroundColor: '#F7F7F7',
                borderRadius: 14,
                overflow: 'hidden',
                elevation: 10,
              }}>
              <HistoryScreen
                orders={orders}
                isLoading={isLoading}
                onBack={() => setShowHistoryModal(false)}
                onProceedToCheckout={handleResumePendingOrder}
              />
            </View>
          </View>
        </Modal>

        {/* Loading Overlay */}
        {isOpeningBill && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#FFFFFF',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
            }}>
            <ActivityIndicator size="large" color="#7C3AED" />

            <Text
              style={{
                marginTop: 12,
                fontSize: 15,
                color: '#333333',
                fontWeight: '600',
              }}>
              Preparing Total Bill...
            </Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;
