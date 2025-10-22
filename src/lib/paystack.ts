export interface PaystackConfig {
  publicKey: string;
  email: string;
  amount: number;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export const initializePaystack = (config: PaystackConfig) => {
  const script = document.createElement('script');
  script.src = 'https://js.paystack.co/v1/inline.js';
  script.async = true;

  script.onload = () => {
    const handler = (window as any).PaystackPop.setup({
      key: config.publicKey,
      email: config.email,
      amount: config.amount * 100,
      currency: 'USD',
      ref: config.reference,
      callback: function(response: any) {
        config.onSuccess(response.reference);
      },
      onClose: function() {
        config.onClose();
      }
    });

    handler.openIframe();
  };

  document.body.appendChild(script);
};

export const generateReference = (): string => {
  return `WWT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
