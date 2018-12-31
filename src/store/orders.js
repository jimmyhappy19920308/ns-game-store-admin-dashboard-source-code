export default {
  namespaced: true,
  state: {
    pagination: {},
    orders: [
      {
        create_at: 154343432,
        id: '',
        is_paid: false,
        message: '',
        paid_date: 1523539924,
        payment_method: '',
        products: [
          {
            id: '',
            product_id: '',
            qty: '3',
            product: {
              title: '',
              unit: '',
            },
          },
        ],
        total: 100,
        user: {
          address: '',
          email: '',
          name: '',
          tel: '',
        },
        num: 1,
      },
    ],
    tempOrder: {
      create_at: 154343432,
      id: '',
      is_paid: false,
      message: '',
      paid_date: 1523539924,
      payment_method: '',
      products: [
        {
          id: '',
          product_id: '',
          qty: '3',
          product: {
            title: '',
            unit: '',
          },
        },
      ],
      total: 100,
      user: {
        address: '',
        email: '',
        name: '',
        tel: '',
      },
      num: 1,
    },
    newDate: 0,
  },
};
