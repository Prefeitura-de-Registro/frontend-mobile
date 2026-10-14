// src/components/organisms/FinalizacaoSucessoModal.tsx
import { SecondaryButton } from '@/components/atoms/SecondaryButton';
import { theme } from '@/constants';
import { Check, X } from 'lucide-react-native';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface FinalizacaoSucessoModalProps {
    visible: boolean;
    onClose: () => void;
}

export function FinalizacaoSucessoModal({ visible, onClose }: FinalizacaoSucessoModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {/* Botão X para fechar (canto superior direito) */}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
                        <X size={24} color="#333333" />
                    </TouchableOpacity>

                    {/* Ícone de Sucesso */}
                    <View style={styles.iconContainer}>
                        <Check size={32} color="#FFFFFF" />
                    </View>

                    {/* Texto de Sucesso */}
                    <Text style={styles.message}>
                        Sua solicitação foi finalizada{'\n'}com sucesso!
                    </Text>

                    {/* Botão de Voltar */}
                    <View style={styles.buttonContainer}>
                        <SecondaryButton label="Voltar" onPress={onClose} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingTop: 48,
        paddingBottom: 32,
        paddingHorizontal: 24,
        width: '100%',
        alignItems: 'center',
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        padding: 8,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#22C79A', // Verde de sucesso do projeto
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    message: {
        fontFamily: theme.fonts.medium,
        fontSize: 18,
        color: '#111111',
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
    },
});