// src/contexts/AttachmentsContext.tsx
import React, { createContext, useContext, useState } from 'react';

type AttachmentsContextData = {
    // Guarda as URIs das imagens locais separadas por ID do ticket
    anexosLocais: Record<number, string[]>;
    adicionarAnexo: (ticketId: number, uri: string) => void;
};

const AttachmentsContext = createContext<AttachmentsContextData>({} as AttachmentsContextData);

export function AttachmentsProvider({ children }: { children: React.ReactNode }) {
    const [anexosLocais, setAnexosLocais] = useState<Record<number, string[]>>({});

    const adicionarAnexo = (ticketId: number, uri: string) => {
        setAnexosLocais((prev) => ({
            ...prev,
            [ticketId]: [...(prev[ticketId] || []), uri],
        }));
    };

    return (
        <AttachmentsContext.Provider value={{ anexosLocais, adicionarAnexo }}>
            {children}
        </AttachmentsContext.Provider>
    );
}

export const useAttachments = () => useContext(AttachmentsContext);