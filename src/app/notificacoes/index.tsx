import { theme } from '@/constants';
import { useRouter } from 'expo-router';
import { ChevronLeft, MoreHorizontal } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const INITIAL_NOTIFICATIONS = [
  {
    id: '1',
    titulo: 'Nova solicitação recebida',
    descricao: 'A Secretaria de Meio Ambiente enviou uma solicitação referente ao chamado #2026-00030.',
    tempo: '30 minutos atrás',
    destacada: false, // Começa desativada (fundo branco)
  },
  {
    id: '2',
    titulo: 'Chamado próximo do prazo',
    descricao: 'O chamado #2026-00187 — Buraco na via está próximo do limite do SLA. Restam 2 horas para o atendimento.',
    tempo: '45 minutos atrás',
    destacada: false, // Começa desativada (fundo branco)
  }
];

export default function NotificacoesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const handlePressNotification = (id: string) => {
    // Alterna a seleção: se clicar na ativa, desativa; se clicar noutra, ativa ela e desativa a anterior
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        destacada: item.id === id ? !item.destacada : false,
      }))
    );
  };

  const renderItem = ({ item }: { item: typeof INITIAL_NOTIFICATIONS[0] }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        item.destacada ? styles.cardCinza : styles.cardBranco
      ]}
      activeOpacity={0.7}
      onPress={() => handlePressNotification(item.id)}
    >
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardDescription}>{item.descricao}</Text>
      <Text style={styles.cardTime}>{item.tempo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
      
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ChevronLeft color="#FFFFFF" size={24} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notificações</Text>

        <TouchableOpacity activeOpacity={0.7} style={styles.moreButton}>
          <MoreHorizontal color="#0072AE" size={28} />
        </TouchableOpacity>
      </View>

      {/* Lista de Notificações */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0072AE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: '#0072AE',
  },
  moreButton: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 12,
  },
  notificationCard: {
    padding: 16,
    borderRadius: 12,
  },
  cardCinza: {
    backgroundColor: '#F3F4F6', // O quadrado cinza em volta quando ativado
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardBranco: {
    backgroundColor: '#FFFFFF', // Fundo branco normal (estado inicial desativado)
    borderWidth: 0,
  },
  cardTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: '#333333',
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: theme.fonts.regular,
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  cardTime: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: '#888888',
  },
});