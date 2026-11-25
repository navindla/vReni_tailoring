import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import {CheckoutBill} from '../types/Order';

interface Props {
  bill: CheckoutBill;
  onBack: () => void;
  onProceedToPayment: () => void;
  onSaveForLater?: () => void;
  isSaving?: boolean;
}

const CheckoutScreen: React.FC<Props> = ({
  bill,
  onBack,
  onProceedToPayment,
  onSaveForLater,
  isSaving = false,
}) => {
  const saveDisabled = isSaving || !onSaveForLater;
  const actionLayout = {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 6,
    justifyContent: 'center',
  } as const;

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const totalQuantity = bill.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Checkout</Text>

        <View style={{width: 55}} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Customer Details</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Customer Name</Text>
          <Text style={styles.value}>{bill.customerName}</Text>

          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>{bill.phoneNumber || 'Not provided'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Bill Items</Text>

        {bill.items.map((item, index) => (
          <View key={`${item.serviceId}-${index}`} style={styles.itemCard}>
            <View style={styles.itemTop}>
              <Text style={styles.itemName}>{item.serviceName}</Text>

              <Text style={styles.itemAmount}>{formatPrice(item.amount)}</Text>
            </View>

            <Text style={styles.itemDetails}>
              {formatPrice(item.price)} × {item.quantity}
            </Text>
          </View>
        ))}

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.label}>Total Quantity</Text>
            <Text style={styles.value}>{totalQuantity}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>

            <Text style={styles.grandTotal}>
              {formatPrice(bill.totalAmount)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, {flexDirection: 'row', gap: 10}]}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            actionLayout,
            {
              backgroundColor: '#FFFFFF',
              borderWidth: 1,
              borderColor: '#7C3AED',
            },
            saveDisabled && {opacity: 0.5},
          ]}
          onPress={onSaveForLater}
          disabled={saveDisabled}
          accessibilityRole="button"
          accessibilityState={{disabled: saveDisabled}}
          activeOpacity={0.8}>
          <Text
            style={[
              styles.confirmText,
              {color: '#7C3AED', textAlign: 'center'},
            ]}>
            SAVE FOR LATER
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            actionLayout,
            isSaving && {opacity: 0.5},
          ]}
          onPress={onProceedToPayment}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityState={{disabled: isSaving}}
          activeOpacity={0.8}>
          <Text style={[styles.confirmText, {textAlign: 'center'}]}>
            PROCEED TO PAYMENT
          </Text>
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
    color: '#333333',
    fontSize: 16,
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
    marginBottom: 10,
    marginTop: 12,
    color: '#222222',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
  },

  label: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    color: '#222222',
    fontWeight: '600',
    marginBottom: 13,
  },

  itemCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 9,
    marginBottom: 9,
  },

  itemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  itemName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
  },

  itemAmount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222222',
  },

  itemDetails: {
    color: '#777777',
    marginTop: 6,
    fontSize: 13,
  },

  totalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginTop: 10,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },

  grandTotalLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222222',
  },

  grandTotal: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#16834A',
  },

  footer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    elevation: 8,
  },

  confirmButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;
