/**
 * ChefTokens translations (EN)
 */

export const tokens = {
  wallet: {
    title: "ChefTokens Wallet",
    balance: "Balance",
    available: "Available",
    locked: "Locked",
    pending: "Pending",
    total: "Total",
    actions: {
      send: "Send",
      receive: "Receive",
      exchange: "Exchange",
      history: "History",
    },
  },

  transactions: {
    title: "Transaction history",
    recent: "Recent transactions",
    all: "All transactions",
    sent: "Sent",
    received: "Received",
    pending: "Pending",
    completed: "Completed",
    failed: "Failed",
    
    type: {
      earn: "Earned",
      spend: "Spent",
      transfer: "Transfer",
      reward: "Reward",
      purchase: "Purchase",
      refund: "Refund",
    },
    
    details: {
      transactionId: "Transaction ID",
      date: "Date",
      amount: "Amount",
      status: "Status",
      from: "From",
      to: "To",
      description: "Description",
      fee: "Fee",
    },
    
    noTransactions: "No transactions",
    loadMore: "Load more",
  },

  earning: {
    title: "Earn tokens",
    subtitle: "Get tokens for activity on the platform",
    
    methods: {
      recipe: {
        title: "Create recipes",
        description: "Get tokens for each published recipe",
        reward: "+10 tokens",
      },
      share: {
        title: "Share",
        description: "Get tokens when others use your recipes",
        reward: "+5 tokens per use",
      },
      review: {
        title: "Review",
        description: "Write valuable reviews and get tokens",
        reward: "+2 tokens per review",
      },
      course: {
        title: "Complete courses",
        description: "Earn tokens for completed course modules",
        reward: "+50 tokens per course",
      },
      daily: {
        title: "Daily login",
        description: "Log in every day and get a bonus",
        reward: "+1 token daily",
      },
      referral: {
        title: "Invite friends",
        description: "Get tokens for each invited user",
        reward: "+100 tokens per referral",
      },
    },
  },

  spending: {
    title: "Spend tokens",
    subtitle: "Use tokens for advanced features",
    
    options: {
      ai: {
        title: "AI-Mentor",
        description: "Use advanced AI-mentor features",
        cost: "1 token per query",
      },
      premium: {
        title: "Premium recipes",
        description: "Unlock exclusive recipes",
        cost: "10-50 tokens",
      },
      courses: {
        title: "Premium courses",
        description: "Access advanced courses",
        cost: "100-500 tokens",
      },
      consultations: {
        title: "Consultations",
        description: "Book individual consultation",
        cost: "200 tokens per hour",
      },
      features: {
        title: "Additional features",
        description: "Unlock new platform features",
        cost: "Various prices",
      },
    },
  },

  exchange: {
    title: "Exchange tokens",
    subtitle: "Exchange tokens for rewards",
    
    from: "From",
    to: "To",
    amount: "Amount",
    amountPlaceholder: "Enter amount",
    rate: "Exchange rate",
    fee: "Fee",
    youGet: "You get",
    exchange: "Exchange",
    cancel: "Cancel",
    
    rewards: {
      title: "Available rewards",
      discount: {
        title: "10% discount",
        description: "Discount on premium courses",
        cost: "50 tokens",
      },
      recipe: {
        title: "Exclusive recipe",
        description: "Access to premium recipe",
        cost: "100 tokens",
      },
      consultation: {
        title: "Consultation",
        description: "1 hour with expert",
        cost: "500 tokens",
      },
      merchandise: {
        title: "Merchandise",
        description: "Fodi brand merchandise",
        cost: "1000 tokens",
      },
    },
  },

  treasury: {
    title: "Token Treasury",
    subtitle: "ChefTokens Bank",
    totalSupply: "Total supply",
    inCirculation: "In circulation",
    locked: "Locked",
    burned: "Burned",
    updated: "Updated",
    loading: "Loading treasury...",
    error: "Error loading treasury data",
    description: "ChefTokens is the platform's internal currency that helps make informed decisions: plan AI queries, unlock recipes and learn to use knowledge without excess and chaos.",
  },

  messages: {
    sendSuccess: "Tokens sent",
    sendError: "Error sending tokens",
    receiveSuccess: "Tokens received",
    exchangeSuccess: "Exchange completed successfully",
    exchangeError: "Exchange error",
    insufficientBalance: "Insufficient balance",
    transactionPending: "Transaction pending...",
    transactionFailed: "Transaction failed",
  },
} as const;
