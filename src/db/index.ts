type Booking = {
  id: number;
  name: string;
  surname: string;
  bookingDate: string;
};

const bookings: Booking[] = [
  {
    id: 1,
    name: "Lorenzo",
    surname: "Leonori",
    bookingDate: "1993/06/27",
  },
  {
    id: 2,
    name: "Ambra",
    surname: "Garofalo",
    bookingDate: "1994/04/13",
  },
];

export default { bookings };
