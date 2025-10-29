"use client";

import { create } from "zustand";
import type { ReactNode } from "react";

type FormActions = {
  onSubmit: () => void;
  onCancel: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
};

type ModalType = "info" | "action" | "form";
type ModalSize = "sm" | "md" | "lg" | "xl" | "normal";

type ModalStore<TData = unknown> = {
  isOpen: boolean;
  modalContent: ReactNode | null;
  modalTitle?: ReactNode;
  modalSize: ModalSize;
  modalType: ModalType;
  data: TData | null;
  formActions?: FormActions;
  customActions?: ReactNode;
  submitLabel?: string;

  openModal: (params: {
    content: ReactNode;
    type?: ModalType;
    customActions?: ReactNode;
  }) => void;
  openInfo?: (content: ReactNode) => void;
  openAction?: (content: ReactNode, actions?: ReactNode) => void;
  openForm?: (content: ReactNode) => void;

  setModalSize: (size: ModalSize) => void;
  setModalTitle: (title: ReactNode | undefined) => void;
  setData: (data: TData | null) => void;
  setFormActions: (actions: FormActions | undefined) => void;
  setSubmitLabel: (label: string | undefined) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalContent: null,
  modalType: "info",
  data: null,
  formActions: undefined,
  customActions: undefined,
  modalSize: "normal",
  submitLabel: undefined,

  setData: (data) => set({ data }),
  setModalSize: (size) => set({ modalSize: size }),
  setModalTitle: (modalTitle) => set({ modalTitle }),
  setFormActions: (formActions) => set({ formActions }),
  setSubmitLabel: (submitLabel) => set({ submitLabel }),

  openModal: ({ content, type = "info", customActions }) =>
    set({
      isOpen: true,
      modalContent: content,
      modalType: type,
      customActions,
    }),
  openInfo: (content) =>
    set({
      isOpen: true,
      modalContent: content,
      modalType: "info",
      customActions: undefined,
    }),
  openAction: (content, actions) =>
    set({
      isOpen: true,
      modalContent: content,
      modalType: "action",
      customActions: actions,
    }),
  openForm: (content) =>
    set({
      isOpen: true,
      modalContent: content,
      modalType: "form",
      customActions: undefined,
    }),

  closeModal: () =>
    set({
      isOpen: false,
      modalContent: null,
      modalType: "info",
      formActions: undefined,
      customActions: undefined,
      modalTitle: undefined,
      submitLabel: undefined,
      data: null,
    }),
}));
