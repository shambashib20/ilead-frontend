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

// Ek modal ka pura state
type ModalParams = {
  content: ReactNode;
  type?: ModalType;
  customActions?: ReactNode;
  title?: ReactNode;
  size?: ModalSize;
  formActions?: FormActions;
  submitLabel?: string;
  data?: unknown;
};

type ModalStore = {
  stack: ModalParams[];
  isOpen: boolean;

  // Current modal helpers (top of stack)
  openModal: (params: ModalParams) => void; // pushModal alias
  pushModal: (params: ModalParams) => void; // naya modal upar
  popModal: () => void; // current close, previous wapas
  closeModal: () => void; // sab band

  // Backward compatible setters (current/top modal ko update karte hain)
  setModalSize: (size: ModalSize) => void;
  setModalTitle: (title: ReactNode | undefined) => void;
  setFormActions: (actions: FormActions | undefined) => void;
  setSubmitLabel: (label: string | undefined) => void;
  setData: (data: unknown) => void;

  // Shortcuts
  openInfo: (content: ReactNode) => void;
  openAction: (content: ReactNode, actions?: ReactNode) => void;
  openForm: (content: ReactNode) => void;
};

export const useModalStore = create<ModalStore>((set, get) => ({
  stack: [],
  isOpen: false,

  pushModal: (params) =>
    set((state) => ({
      stack: [...state.stack, params],
      isOpen: true,
    })),

  openModal: (params) => get().pushModal(params), // alias

  popModal: () =>
    set((state) => {
      const newStack = state.stack.slice(0, -1);
      return {
        stack: newStack,
        isOpen: newStack.length > 0,
      };
    }),

  closeModal: () =>
    set({
      stack: [],
      isOpen: false,
    }),

  // Top of stack ko update karne ke liye
  setModalSize: (size) =>
    set((state) => {
      if (state.stack.length === 0) return state;
      const newStack = [...state.stack];
      newStack[newStack.length - 1] = {
        ...newStack[newStack.length - 1],
        size,
      };
      return { stack: newStack };
    }),

  setModalTitle: (title) =>
    set((state) => {
      if (state.stack.length === 0) return state;
      const newStack = [...state.stack];
      newStack[newStack.length - 1] = {
        ...newStack[newStack.length - 1],
        title,
      };
      return { stack: newStack };
    }),

  setFormActions: (formActions) =>
    set((state) => {
      if (state.stack.length === 0) return state;
      const newStack = [...state.stack];
      newStack[newStack.length - 1] = {
        ...newStack[newStack.length - 1],
        formActions,
      };
      return { stack: newStack };
    }),

  setSubmitLabel: (submitLabel) =>
    set((state) => {
      if (state.stack.length === 0) return state;
      const newStack = [...state.stack];
      newStack[newStack.length - 1] = {
        ...newStack[newStack.length - 1],
        submitLabel,
      };
      return { stack: newStack };
    }),

  setData: (data) =>
    set((state) => {
      if (state.stack.length === 0) return state;
      const newStack = [...state.stack];
      newStack[newStack.length - 1] = {
        ...newStack[newStack.length - 1],
        data,
      };
      return { stack: newStack };
    }),

  openInfo: (content) => get().pushModal({ content, type: "info" }),
  openAction: (content, actions) =>
    get().pushModal({ content, type: "action", customActions: actions }),
  openForm: (content) => get().pushModal({ content, type: "form" }),
}));
