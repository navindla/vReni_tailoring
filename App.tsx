
import React, { useRef, useState } from 'react';

import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  Modal,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { Service } from './Vreni/src/types/Service';
import { CheckoutBill } from './Vreni/src/types/Order';

import ServicesScreen from './Vreni/src/screens/ServicesScreen';
import BillScreen from './Vreni/src/screens/BillScreen';
import CheckoutScreen from './Vreni/src/screens/CheckoutScreen';
import PaymentQrScreen from './Vreni/src/screens/PaymentQrScreen';
import HistoryScreen from './Vreni/src/screens/HistoryScreen';

import { useOrderHistory } from './Vreni/src/hooks/useOrderHistory';

type Screen = 'services' | 'bill' | 'checkout' | 'payment' | 'history';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>('services');

  const [selectedServices, setSelectedServices] =
    useState<Service[]>([]);

  const [checkoutBill, setCheckoutBill] =
    useState<CheckoutBill | null>(null);

  const [isOpeningBill, setIsOpeningBill] = useState(false);
  const [hasOpenedBill, setHasOpenedBill] = useState(false);

  // New: Home screen history popup visibility
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const openingBillRef = useRef(false);

  const {
    orders,
    isLoading,
    isSaving,
    saveOrder,
  } = useOrderHistory();

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

  // Confirm payment manually and save order
  const handlePaymentConfirmed = async () => {
    if (!checkoutBill || isSaving) return;

    const success = await saveOrder(checkoutBill);

    if (success) {
      setCheckoutBill(null);
      setSelectedServices([]);
      setHasOpenedBill(false);
      setCurrentScreen('history');

      Alert.alert('Success', 'Payment confirmed and order saved.');
    } else {
      Alert.alert(
        'Error',
        'Unable to save order. Please try again.',
      );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}
        edges={['top', 'bottom']}
      >
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
            }}
          >
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
            onBack={() => setCurrentScreen('bill')}
            onProceedToPayment={handleProceedToPayment}
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
          />
        )}

        {/* New: Home Screen History Popup */}
        <Modal
          visible={showHistoryModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowHistoryModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.55)',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 12,
            }}
          >
            <View
              style={{
                width: '100%',
                height: '85%',
                backgroundColor: '#F7F7F7',
                borderRadius: 14,
                overflow: 'hidden',
                elevation: 10,
              }}
            >
              <HistoryScreen
                orders={orders}
                isLoading={isLoading}
                onBack={() => setShowHistoryModal(false)}
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
            }}
          >
            <ActivityIndicator
              size="large"
              color="#7C3AED"
            />

            <Text
              style={{
                marginTop: 12,
                fontSize: 15,
                color: '#333333',
                fontWeight: '600',
              }}
            >
              Preparing Total Bill...
            </Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;


//// PROJ CODE ABV /////





// import React from 'react';
// import {
//   SafeAreaView,
//   StatusBar,
//   StyleSheet,
// } from 'react-native';
// import PaymentQrScreen from './Vreni/src/screens/PaymentQrScreen';



// const App: React.FC = () => {
//   const handleBack = () => {
//     console.log('Back button pressed');
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar
//         backgroundColor="#f8fafc"
//         barStyle="dark-content"
//       />

//       <PaymentQrScreen
//         amount={10}
//         onBack={handleBack}
//       />
//     </SafeAreaView>
//   );
// };

// export default App;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },
// });

