

import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Service } from '../types/Service';
import { CheckoutBill } from '../types/Order';
import { useBill } from '../hooks/useBill';

interface Props {
  services: Service[];
  onBack: () => void;
  onCheckout: (bill: CheckoutBill) => void;
  isVisible: boolean;
}

const BillScreen: React.FC<Props> = ({
  services,
  onBack,
    isVisible,
  onCheckout,
}) => {
  const {
    items,
    customerName,
    phoneNumber,
    totalAmount,
    totalQuantity,
    canCheckout,
    setCustomerName,
    setPhoneNumber,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    getCheckoutData,
  } = useBill(services);

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
  if (isVisible) {
    setIsCheckingOut(false);
  }
}, [isVisible]);

  const formatPrice = (price: number) =>
    `₹${price.toLocaleString('en-IN')}`;

const handleCheckout = () => {
  if (isCheckingOut) return;

  const bill = getCheckoutData();

  if (!customerName.trim()) {
    Alert.alert('Required', 'Please enter customer name.');
    return;
  }

  if (items.length === 0) {
    Alert.alert('Empty Bill', 'Please add at least one item.');
    return;
  }

  if (!bill) {
    Alert.alert('Error', 'Unable to prepare bill.');
    return;
  }

  setIsCheckingOut(true);

  setTimeout(() => {
    onCheckout(bill);
  }, 500);
};

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Total Bill</Text>

        <View style={{ width: 50 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >

        {/* Customer Details */}
        <Text style={styles.sectionTitle}>
          Customer Details
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Customer Name *</Text>

          <TextInput
            placeholder="Enter customer name"
            value={customerName}
            onChangeText={setCustomerName}
            style={styles.input}
          />

          <Text style={styles.label}>Phone Number (Optional)</Text>

          <TextInput
            placeholder="Enter phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={15}
            style={styles.input}
          />
        </View>

        {/* Bill Items */}
        <Text style={styles.sectionTitle}>
          Selected Items ({items.length})
        </Text>

        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No items available in this bill.
            </Text>
          </View>
        ) : (
          items.map(item => (
            <View key={item.serviceId} style={styles.itemCard}>

              <View style={styles.itemHeader}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.serviceName}
                  </Text>

                  <Text style={styles.itemPrice}>
                    Unit Price: {formatPrice(item.price)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => removeItem(item.serviceId)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.itemFooter}>

                {/* Quantity Controls */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    onPress={() => decreaseQuantity(item.serviceId)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.quantityText}>
                    {item.quantity}
                  </Text>

                  <TouchableOpacity
                    onPress={() => increaseQuantity(item.serviceId)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.itemAmount}>
                  {formatPrice(item.amount)}
                </Text>

              </View>
            </View>
          ))
        )}

        {/* Bill Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Total Items
            </Text>

            <Text style={styles.summaryValue}>
              {items.length}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Total Quantity
            </Text>

            <Text style={styles.summaryValue}>
              {totalQuantity}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>
              Grand Total
            </Text>

            <Text style={styles.grandTotal}>
              {formatPrice(totalAmount)}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Checkout Button */}
{/* Checkout Button */}
<View style={styles.footer}>
  <TouchableOpacity
    onPress={handleCheckout}
    disabled={!canCheckout || isCheckingOut}
    style={[
      styles.checkoutButton,
      (!canCheckout || isCheckingOut) && styles.disabledButton,
    ]}
  >
    {isCheckingOut ? (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#FFFFFF" />
        <Text style={styles.checkoutButtonText}>
          Preparing Checkout...
        </Text>
      </View>
    ) : (
      <Text style={styles.checkoutButtonText}>
        Review & Checkout
      </Text>
    )}
  </TouchableOpacity>
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  loadingContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
},

  header: {
    height: 58,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    elevation: 2,
  },

  backText: {
    fontSize: 16,
    color: '#333333',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#222222',
  },

  content: {
    padding: 16,
    paddingBottom: 25,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
    marginTop: 12,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },

  label: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 15,
    color: '#222222',
  },

  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },

  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  itemInfo: {
    flex: 1,
  },

  itemName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222222',
  },

  itemPrice: {
    color: '#777777',
    fontSize: 13,
    marginTop: 5,
  },

  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FCE8E8',
    borderRadius: 6,
  },

  deleteText: {
    color: '#D32F2F',
    fontSize: 12,
    fontWeight: '600',
  },

  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  quantityButton: {
    width: 34,
    height: 34,
    backgroundColor: '#EEEEEE',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityButtonText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#222222',
  },

  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },

  itemAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16834A',
  },

  emptyCard: {
    padding: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    alignItems: 'center',
  },

  emptyText: {
    color: '#888888',
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginTop: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#777777',
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 10,
  },

  grandTotalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  grandTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#16834A',
  },

  footer: {
    padding: 15,
    backgroundColor: '#FFFFFF',
    elevation: 8,
  },

  checkoutButton: {
    backgroundColor: '#16834A',
    padding: 16,
    borderRadius: 9,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.4,
  },

  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BillScreen;
