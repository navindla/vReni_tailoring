import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {Order} from '../types/Order';

interface Props {
  orders: Order[];
  isLoading: boolean;
  onBack: () => void;
  onProceedToCheckout?: (order: Order) => void;
}

const HistoryScreen: React.FC<Props> = ({
  orders,
  isLoading,
  onBack,
  onProceedToCheckout,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const formatPrice = (price: number) => `₹${price.toLocaleString('en-IN')}`;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Order History</Text>
        <View style={{width: 55}} />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          style={{marginTop: 40}}
          color="#16834A"
        />
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Orders Yet</Text>
          <Text style={styles.emptyText}>
            Completed orders will appear here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.countText}>Total Orders: {orders.length}</Text>

          {orders.map(order => {
            const expanded = expandedOrderId === order.id;

            return (
              <View key={order.id} style={styles.orderCard}>
                <TouchableOpacity
                  onPress={() =>
                    setExpandedOrderId(expanded ? null : order.id)
                  }>
                  <View style={styles.orderTop}>
                    <View style={{flex: 1}}>
                      <Text style={styles.customerName}>
                        {order.customerName}
                      </Text>

                      <Text style={styles.orderId}>{order.id}</Text>
                    </View>

                    <Text style={styles.orderTotal}>
                      {formatPrice(order.totalAmount)}
                    </Text>
                  </View>

                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor:
                        order.paymentStatus === 'PENDING_PAYMENT'
                          ? '#FFF1CC'
                          : order.paymentStatus === 'PAYMENT_CONFIRMED'
                          ? '#DDF4E5'
                          : '#EEEEEE',
                      borderRadius: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        color:
                          order.paymentStatus === 'PENDING_PAYMENT'
                            ? '#754700'
                            : order.paymentStatus === 'PAYMENT_CONFIRMED'
                            ? '#145C32'
                            : '#333333',
                        fontSize: 12,
                        fontWeight: '600',
                      }}>
                      {order.paymentStatus === 'PENDING_PAYMENT'
                        ? 'Pending'
                        : order.paymentStatus === 'PAYMENT_CONFIRMED'
                        ? 'Completed'
                        : 'Status Unknown'}
                    </Text>
                  </View>

                  <Text style={styles.dateText}>
                    {formatDate(order.createdAt)}
                  </Text>

                  <Text style={styles.expandText}>
                    {expanded ? 'Hide Details ▲' : 'View Details ▼'}
                  </Text>
                </TouchableOpacity>

                {order.paymentStatus === 'PENDING_PAYMENT' &&
                  onProceedToCheckout && (
                    <TouchableOpacity
                      style={styles.proceedButton}
                      onPress={() => onProceedToCheckout(order)}>
                      <Text style={styles.proceedButtonText}>PROCEED</Text>
                    </TouchableOpacity>
                  )}

                {expanded && (
                  <View style={styles.details}>
                    <Text style={styles.detailHeading}>Customer Details</Text>

                    <Text style={styles.detailText}>
                      Phone: {order.phoneNumber || 'Not provided'}
                    </Text>

                    <Text style={styles.detailHeading}>Items</Text>

                    {order.items.map((item, index) => (
                      <View
                        key={`${item.serviceId}-${index}`}
                        style={styles.itemRow}>
                        <View style={{flex: 1}}>
                          <Text style={styles.itemName}>
                            {item.serviceName}
                          </Text>

                          <Text style={styles.detailText}>
                            {formatPrice(item.price)} × {item.quantity}
                          </Text>
                        </View>

                        <Text style={styles.itemAmount}>
                          {formatPrice(item.amount)}
                        </Text>
                      </View>
                    ))}

                    <View style={styles.finalTotal}>
                      <Text style={styles.detailHeading}>Grand Total</Text>

                      <Text style={styles.orderTotal}>
                        {formatPrice(order.totalAmount)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
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
    padding: 15,
  },
  countText: {
    color: '#666666',
    marginBottom: 12,
    fontSize: 14,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222222',
  },
  orderId: {
    color: '#888888',
    fontSize: 12,
    marginTop: 4,
  },
  orderTotal: {
    color: '#16834A',
    fontWeight: 'bold',
    fontSize: 17,
  },
  dateText: {
    color: '#777777',
    fontSize: 12,
    marginTop: 10,
  },
  expandText: {
    color: '#16834A',
    fontWeight: '600',
    marginTop: 12,
  },
  proceedButton: {
    backgroundColor: 'transparent',
    borderColor: '#16834A',
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'center',
    alignSelf: 'center',
  },
  proceedButtonText: {
    color: '#16834A',
    fontWeight: '600',
    fontSize: 13,
  },
  details: {
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    marginTop: 14,
    paddingTop: 12,
  },
  detailHeading: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333333',
    marginTop: 8,
    marginBottom: 7,
  },
  detailText: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: {
    color: '#333333',
    fontWeight: '600',
    fontSize: 14,
  },
  itemAmount: {
    color: '#333333',
    fontWeight: 'bold',
  },
  finalTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333333',
  },
  emptyText: {
    color: '#888888',
    marginTop: 8,
  },
});

export default HistoryScreen;
