
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import VreniQr from '../native/VreniQr';

interface Props {
  amount: number;
  isSaving: boolean;
  onBack: () => void;
  onPaymentConfirmed: () => void;
}

const UPI_ID = '7702652464@ybl';
const PAYEE_NAME = 'Vreni Ladies Tailoring';

const PaymentQrScreen: React.FC<Props> = ({
  amount,
  isSaving,
  onBack,
  onPaymentConfirmed,
}) => {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    generatePaymentQr();
  }, [amount]);

  const generatePaymentQr = async () => {
    try {
      setLoading(true);
      setError('');
      setQrImage(null);

      if (!amount || amount <= 0) {
        throw new Error('Invalid payment amount.');
      }

      const upiUri =
        `upi://pay?pa=${encodeURIComponent(UPI_ID)}` +
        `&pn=${encodeURIComponent(PAYEE_NAME)}` +
        `&am=${amount.toFixed(2)}` +
        `&cu=INR` +
        `&tn=${encodeURIComponent('Vreni Tailoring Payment')}`;

      const base64Image = await VreniQr.generateQr(upiUri, 500);

      setQrImage(`data:image/png;base64,${base64Image}`);
    } catch (err) {
      console.error('QR generation error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to generate payment QR code.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          disabled={isSaving}
        >
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 55 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Scan this QR code using any UPI payment app.
        </Text>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>

          <Text style={styles.amount}>
            ₹{amount.toFixed(2)}
          </Text>
        </View>

        <View style={styles.qrContainer}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#2563eb"
            />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={generatePaymentQr}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : qrImage ? (
            <Image
              source={{ uri: qrImage }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          ) : null}
        </View>

        <Text style={styles.instruction}>
          1. Open PhonePe, Google Pay or another UPI app.
          {'\n'}
          2. Scan the QR code.
          {'\n'}
          3. Verify the recipient and amount.
          {'\n'}
          4. Complete the payment.
        </Text>

        <Text style={styles.warning}>
          Only confirm after checking that the payment has actually
          been received in your account.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (loading || !!error || isSaving) && styles.disabledButton,
          ]}
          onPress={onPaymentConfirmed}
          disabled={loading || !!error || isSaving}
          activeOpacity={0.8}
        >
          {isSaving ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
              <Text style={styles.confirmText}>
                Saving Order...
              </Text>
            </View>
          ) : (
            <Text style={styles.confirmText}>
              Payment Received – Confirm Order
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
    backgroundColor: '#F8FAFC',
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
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
  },

  amountContainer: {
    marginTop: 25,
    alignItems: 'center',
  },

  amountLabel: {
    fontSize: 15,
    color: '#64748B',
  },

  amount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#15803D',
    marginTop: 5,
  },

  qrContainer: {
    width: 280,
    height: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    elevation: 3,
  },

  qrImage: {
    width: 250,
    height: 250,
  },

  errorContainer: {
    alignItems: 'center',
    padding: 15,
  },

  errorText: {
    color: '#DC2626',
    textAlign: 'center',
    fontSize: 14,
  },

  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 15,
  },

  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  instruction: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 22,
    marginTop: 22,
    alignSelf: 'stretch',
  },

  warning: {
    fontSize: 12,
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    lineHeight: 18,
    alignSelf: 'stretch',
  },

  footer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    elevation: 8,
  },

  confirmButton: {
    backgroundColor: '#15803D',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },
});

export default PaymentQrScreen;
