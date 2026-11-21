import React, {useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import {useServices} from '../hooks/useServices';
import {Service} from '../types/Service';

interface Props {
  onConfirm: (services: Service[]) => void;
  onViewHistory: () => void;
}

const ServicesScreen: React.FC<Props> = ({onConfirm, onViewHistory}) => {
  const {
    services,
    selectedServices,
    selectedCount,
    toggleService,
    isSelected,
    updateServicePrice,
    isLoading,
    error,
    addCustomService,
    clearSelection,
  } = useServices();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState('');

  const [customDescription, setCustomDescription] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const categories = [...new Set(services.map(item => item.category))];

  const startEditing = (service: Service) => {
    setEditingId(service.id);
    setPriceInput(String(service.price));
  };

  const handleAddCustomService = async () => {
    const description = customDescription.trim();
    const price = Number(customPrice);

    if (!description) {
      Alert.alert('Validation', 'Please enter item description.');
      return;
    }

    if (customPrice.trim() === '' || !Number.isFinite(price) || price < 0) {
      Alert.alert('Validation', 'Please enter a valid price.');
      return;
    }

    const success = await addCustomService(description, price);

    if (success) {
      setCustomDescription('');
      setCustomPrice('');
      setShowCustomForm(false);
      Alert.alert('Success', 'Custom item added successfully.');
    } else {
      Alert.alert('Error', 'Unable to add custom item.');
    }
  };

  const savePrice = async (id: string) => {
    const price = Number(priceInput);

    if (priceInput.trim() === '' || !Number.isSafeInteger(price) || price < 0) {
      Alert.alert('Invalid Price', 'Enter a valid whole-number price.');
      return;
    }

    const success = await updateServicePrice(id, price);

    if (success) {
      setEditingId(null);
      setPriceInput('');
    } else {
      Alert.alert('Error', 'Unable to update service price.');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#9B526D" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  if (error && services.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <View style={styles.header}>
        <Text style={styles.brand}>VRENI</Text>
        <Text style={styles.subtitle}>Ladies Tailoring</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Our Services</Text>
        <Text style={styles.description}>
          Select services and manage prices
        </Text>
      </View>

      <TouchableOpacity
        onPress={onViewHistory}
        style={{
          backgroundColor: '#16834A',
          padding: 14,
          borderRadius: 8,
          marginHorizontal: 6,
          marginBottom: 12,
        }}>
        <Text
          style={{
            color: '#FFFFFF',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 15,
          }}>
          View Transaction History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowCustomForm(!showCustomForm)}
        style={{
          backgroundColor: '#222',
          padding: 14,
          borderRadius: 8,
          marginBottom: 12,
          margin: 6,
        }}>
        <Text style={{color: '#fff', textAlign: 'center', fontWeight: 'bold'}}>
          + Add Custom Item
        </Text>
      </TouchableOpacity>

      {showCustomForm && (
        <View
          style={{
            padding: 15,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            marginBottom: 15,
          }}>
          <Text style={{fontWeight: 'bold', marginBottom: 10}}>
            New Custom Item
          </Text>

          <TextInput
            placeholder="Enter item description"
            placeholderTextColor="#999999"
            value={customDescription}
            onChangeText={setCustomDescription}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 6,
              padding: 10,
              marginBottom: 10,
              color: '#000000', // User-entered text color
            }}
          />

          <TextInput
            placeholder="Enter price (₹)"
            placeholderTextColor="#999999"
            value={customPrice}
            onChangeText={setCustomPrice}
            keyboardType="decimal-pad"
            style={{
              borderWidth: 1,
              borderColor: '#e59696',
              borderRadius: 6,
              padding: 10,
              marginBottom: 12,
              color: '#000000', // User-entered text color
            }}
          />

          <TouchableOpacity
            onPress={handleAddCustomService}
            style={{
              backgroundColor: '#16834A',
              padding: 12,
              borderRadius: 6,
            }}>
            <Text
              style={{color: '#fff', textAlign: 'center', fontWeight: 'bold'}}>
              Save Custom Item
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}>
        {categories.map(category => (
          <View key={category}>
            <Text style={styles.categoryTitle}>{category}</Text>

            {services
              .filter(item => item.category === category)
              .map(item => {
                const selected = isSelected(item.id);
                const editing = editingId === item.id;

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.serviceCard,
                      selected && styles.selectedCard,
                    ]}>
                    <Pressable
                      style={styles.serviceInfo}
                      onPress={() => !editing && toggleService(item.id)}
                      disabled={editing}>
                      <Text style={styles.serviceName}>{item.name}</Text>

                      {!editing && (
                        <Text style={styles.price}>₹{item.price}</Text>
                      )}
                    </Pressable>

                    <View style={styles.rightContainer}>
                      {editing ? (
                        <View style={styles.editContainer}>
                          <TextInput
                            value={priceInput}
                            onChangeText={setPriceInput}
                            keyboardType="number-pad"
                            style={styles.priceInput}
                            autoFocus
                            selectTextOnFocus
                          />

                          <Pressable
                            onPress={() => savePrice(item.id)}
                            style={styles.saveButton}>
                            <Text style={styles.actionText}>Save</Text>
                          </Pressable>

                          <Pressable
                            onPress={() => setEditingId(null)}
                            style={styles.cancelButton}>
                            <Text style={styles.actionText}>×</Text>
                          </Pressable>
                        </View>
                      ) : (
                        <View style={styles.actionContainer}>
                          <Pressable
                            onPress={() => startEditing(item)}
                            style={styles.editButton}>
                            <Text style={styles.editText}>Edit</Text>
                          </Pressable>

                          <Pressable
                            onPress={() => toggleService(item.id)}
                            style={[
                              styles.checkbox,
                              selected && styles.checkedBox,
                            ]}>
                            {selected && (
                              <Text style={styles.checkmark}>✓</Text>
                            )}
                          </Pressable>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionCount}>
            {selectedCount} Items Selected
          </Text>
          <Text style={styles.selectionHint}>Select services to continue</Text>
        </View>

        <Pressable
          disabled={selectedCount === 0 || editingId !== null}
          onPress={() => onConfirm(selectedServices)}
          style={[
            styles.confirmButton,
            (selectedCount === 0 || editingId !== null) &&
              styles.disabledButton,
          ]}>
          <Text style={styles.confirmText}>Confirm →</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F6',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAF8F6',
  },
  loadingText: {
    marginTop: 12,
    color: '#777777',
  },
  errorText: {
    color: '#C45A66',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EAE5',
  },
  brand: {
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: 4,
    color: '#9B526D',
  },
  subtitle: {
    fontSize: 13,
    color: '#777777',
    marginTop: 3,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 10,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    color: '#292323',
  },
  description: {
    fontSize: 13,
    color: '#888888',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 18,
    paddingBottom: 15,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9B526D',
    marginTop: 18,
    marginBottom: 10,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F0EAE5',
  },
  selectedCard: {
    borderColor: '#9B526D',
    backgroundColor: '#FFF5F8',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#302929',
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9B526D',
    marginTop: 6,
  },
  rightContainer: {
    marginLeft: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: '#F8EAF0',
    borderRadius: 7,
  },
  editText: {
    color: '#9B526D',
    fontWeight: '600',
    fontSize: 12,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: '#CFC5C5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#9B526D',
    borderColor: '#9B526D',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priceInput: {
    width: 75,
    height: 38,
    borderWidth: 1,
    borderColor: '#9B526D',
    borderRadius: 7,
    paddingHorizontal: 8,
    color: '#302929',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#9B526D',
    padding: 9,
    borderRadius: 7,
  },
  cancelButton: {
    backgroundColor: '#777777',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 7,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  bottomContainer: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderTopWidth: 1,
    borderTopColor: '#F0EAE5',
  },
  selectionInfo: {
    marginBottom: 12,
  },
  selectionCount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#302929',
  },
  selectionHint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 3,
  },
  confirmButton: {
    backgroundColor: '#9B526D',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#C9B9BF',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ServicesScreen;
