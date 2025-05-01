import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { getShowById } from "../api/shows";
import { useNavigate, useParams } from "react-router-dom";
import { message, Card, Row, Col, Button } from "antd";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout"; // Stripe Checkout
import { bookShow, makePayment } from "../api/bookings";

const BookShow = () => {
  const { user } = useSelector((state) => state.users);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const response = await getShowById({ showId: params.id });
      if (response) {
        setShow(response.data); // Fixed this line
        console.log(response.data);
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getSeats = () => {
    let columns = 12; // Number of seats in each row
    let totalSeats = 120; // Total number of seats
    let rows = totalSeats / columns; // Number of rows (e.g., 10)
    let rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Labels for rows

    return (
      <div
        className="d-flex flex-column align-items-center"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="w-100 max-width-600 mx-auto mb-25px">
          <p className="text-center mb-10px">
            Screen this side, you will be watching in this direction
          </p>
          <div className="screen-div"></div>
        </div>
        <div
          className="seat-rows"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px", // Space between rows
          }}
        >
          {Array.from(Array(rows).keys()).map((row) => (
            <div
              key={`row-${row}`}
              className="seat-row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                width: "80%",
                maxWidth: "600px", // Limit the width for alignment
              }}
            >
              {/* Row Label */}
              <span
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  width: "20px", // Consistent width for row labels
                  textAlign: "center",
                }}
              >
                {rowLabels[row]}
              </span>

              {/* Seats */}
              <div
                style={{
                  display: "flex",
                  gap: "5px", // Space between seats
                }}
              >
                {Array.from(Array(columns).keys()).map((column) => {
                  let seatNumber = row * columns + column + 1;

                  let seatClass = "seat-btn";
                  if (selectedSeats.includes(seatNumber)) {
                    seatClass += " selected";
                  }
                  if (show && show.bookedSeats.includes(seatNumber)) {
                    seatClass += " booked";
                  }

                  return (
                    <button
                      key={`seat-${row}-${column}`}
                      className={seatClass}
                      style={{
                        width: "30px",
                        height: "30px",
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        backgroundColor: selectedSeats.includes(seatNumber)
                          ? "green" // Green for selected seats
                          : show && show.bookedSeats.includes(seatNumber)
                          ? "red" // Red for booked seats
                          : "#f0f0f0", // Default color for available seats
                        cursor: "pointer",
                        color: "#000",
                      }}
                      onClick={() => {
                        if (selectedSeats.includes(seatNumber)) {
                          setSelectedSeats(
                            selectedSeats.filter(
                              (curSeatNumber) => curSeatNumber !== seatNumber
                            )
                          );
                        } else {
                          setSelectedSeats([...selectedSeats, seatNumber]);
                        }
                      }}
                    >
                      {column + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
          Selected Seats:{" "}
          <span>
            {selectedSeats
              .map((seatNumber) => {
                const rowIndex = Math.floor((seatNumber - 1) / columns); // Determine row index
                const columnNumber = ((seatNumber - 1) % columns) + 1; // Determine column number
                return `${rowLabels[rowIndex]}${columnNumber}`; // Convert to row letter + column number
              })
              .join(", ")}
          </span>
          <div className="flex-shrink-0 ms-3">
            Total Price:{" "}
            <span>
              Rs. {selectedSeats.length * (show ? show.ticketPrice : 0)}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const onToken = async (token) => {
    try {
      const response = await makePayment(
        token,
        selectedSeats.length * show.ticketPrice * 100
      );
      console.log(response);
      const transactionId = response.data;
      if (response.success) {
        message.success(response.message);
        const resp = await bookShow({
          show: params.id,
          transactionId,
          seats: selectedSeats,
          user: user._id,
        });
        if (resp.success) {
          message.success(resp.message);
          navigate("/profile");
        } else {
          message.error("Failed to book show");
        }
      } else {
        message.error(response.message);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <>
      {show && (
        <Row gutter={24}>
          <Col span={24}>
            <Card
              title={
                <div className="movie-title-details">
                  <h1>{show.movie.movieName}</h1>
                  <p>
                    Theatre: {show.theatre.name}, {show.theatre.address}
                  </p>
                </div>
              }
              extra={
                <div className="show-name py-3">
                  <h3>
                    <span>Show Name:</span> {show.name}
                  </h3>
                  <h3>
                    <span>Date & Time: </span>
                    {moment(show.date).format("MMM Do YYYY")} at{" "}
                    {moment(show.time, "HH:mm").format("hh:mm A")}
                  </h3>
                  <h3>
                    <span>Ticket Price:</span> Rs. {show.ticketPrice}/-
                  </h3>
                  <h3>
                    <span>Total Seats:</span> {show.totalSeats}
                    <span> &nbsp;|&nbsp; Available Seats:</span>{" "}
                    {show.totalSeats - show.bookedSeats.length}{" "}
                  </h3>
                </div>
              }
              style={{ width: "100%" }}
            >
              {getSeats()}
              {selectedSeats.length > 0 && (
                <StripeCheckout
                  token={onToken}
                  billingAddress
                  amount={selectedSeats.length * show.ticketPrice * 100}
                  stripeKey="pk_test_51QhyviKoC5CMR7XbjYwo36g2jM6Y2YnK5IzMZaflbCXWk6mOp2Pm883yReUiwfZuhFedoXS5Oxil1E8SStdpDpuh00ctMtMLzW"
                >
                  {/* Use this one in some situation=> pk_test_eTH82XLklCU1LJBkr2cSDiGL001Bew71X8  */}
                  <div className="max-width-600 mx-auto">
                    <Button type="primary" shape="round" size="large" block>
                      Pay Now
                    </Button>
                  </div>
                </StripeCheckout>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default BookShow;
//=====================================================================================
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { getShowById } from "../api/shows";
// import { useNavigate, useParams } from "react-router-dom";
// import { message, Card, Row, Col, Button } from "antd";
// import moment from "moment";
// import StripeCheckout from "react-stripe-checkout"; // Stripe Checkout
// import { bookShow, makePayment } from "../api/bookings";

// const BookShow = () => {
//   const { user } = useSelector((state) => state.users);
//   const [show, setShow] = useState();
//   const [selectedSeats, setSelectedSeats] = useState([]);
//   const params = useParams();
//   const navigate = useNavigate();

//   const getData = async () => {
//     try {
//       const response = await getShowById({ showId: params.id });
//       console.log("the response we are getting :", response);
//       if (response.success) {
//         setShow(response.data);
//         // message.success(response.message);
//         console.log(response.data);
//       } else {
//         message.error(response.message);
//       }
//     } catch (err) {
//       message.error(err.message);
//     }
//   };

//   const getSeats = () => {
//     let columns = 12; // Number of seats in each row
//     let totalSeats = 120; // Total number of seats
//     let rows = totalSeats / columns; // Number of rows (e.g., 10)
//     let rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Labels for rows

//     return (
//       <div
//         className="d-flex flex-column align-items-center"
//         style={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <div className="w-100 max-width-600 mx-auto mb-25px">
//           <p className="text-center mb-10px">
//             Screen this side, you will be watching in this direction
//           </p>
//           <div className="screen-div"></div>
//         </div>
//         <div
//           className="seat-rows"
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             alignItems: "center",
//             gap: "10px", // Space between rows
//           }}
//         >
//           {Array.from(Array(rows).keys()).map((row) => (
//             <div
//               key={`row-${row}`}
//               className="seat-row"
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 gap: "10px",
//                 width: "80%",
//                 maxWidth: "600px", // Limit the width for alignment
//               }}
//             >
//               {/* Row Label */}
//               <span
//                 style={{
//                   fontWeight: "bold",
//                   fontSize: "16px",
//                   width: "20px", // Consistent width for row labels
//                   textAlign: "center",
//                 }}
//               >
//                 {rowLabels[row]}
//               </span>

//               {/* Seats */}
//               <div
//                 style={{
//                   display: "flex",
//                   gap: "5px", // Space between seats
//                 }}
//               >
//                 {Array.from(Array(columns).keys()).map((column) => {
//                   let seatNumber = row * columns + column + 1;

//                   let seatClass = "seat-btn";
//                   if (selectedSeats.includes(seatNumber)) {
//                     seatClass += " selected";
//                   }
//                   if (show && show.bookedSeats.includes(seatNumber)) {
//                     seatClass += " booked";
//                   }

//                   return (
//                     <button
//                       key={`seat-${row}-${column}`}
//                       className={seatClass}
//                       style={{
//                         width: "30px",
//                         height: "30px",
//                         textAlign: "center",
//                         border: "1px solid #ccc",
//                         borderRadius: "5px",
//                         backgroundColor: selectedSeats.includes(seatNumber)
//                           ? "green" // Green for selected seats
//                           : show && show.bookedSeats.includes(seatNumber)
//                           ? "red" // Red for booked seats
//                           : "#f0f0f0", // Default color for available seats
//                         cursor: "pointer",
//                         color: "#000",
//                       }}
//                       onClick={() => {
//                         if (selectedSeats.includes(seatNumber)) {
//                           setSelectedSeats(
//                             selectedSeats.filter(
//                               (curSeatNumber) => curSeatNumber !== seatNumber
//                             )
//                           );
//                         } else {
//                           setSelectedSeats([...selectedSeats, seatNumber]);
//                         }
//                       }}
//                     >
//                       {column + 1}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
//           Selected Seats:{" "}
//           <span>
//             {selectedSeats
//               .map((seatNumber) => {
//                 const rowIndex = Math.floor((seatNumber - 1) / columns); // Determine row index
//                 const columnNumber = ((seatNumber - 1) % columns) + 1; // Determine column number
//                 return `${rowLabels[rowIndex]}${columnNumber}`; // Convert to row letter + column number
//               })
//               .join(", ")}
//           </span>
//           <div className="flex-shrink-0 ms-3">
//             Total Price:{" "}
//             <span>
//               Rs. {selectedSeats.length * (show ? show.ticketPrice : 0)}
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const onToken = async (token) => {
//     console.log("Stripe token is", token);
//     const amount = selectedSeats.length * show.ticketPrice * 100; // Amount in cents
//     console.log("Calculated amount:", amount);
//     try {
//       const response = await makePayment(token, amount);
//       console.log("The token and amount is:", response);
//       const transactionId = response.data;
//       if (response.success) {
//         message.success(response.message);
//         const resp = await bookShow({
//           show: params.id,
//           transactionId,
//           seats: selectedSeats,
//           user: user._id,
//         });
//         if (resp.success) {
//           console.log("the booking response is:", resp);
//           message.success(resp.message);
//           navigate("/profile");
//         } else {
//           console.log("failed to book the show");
//           message.error("Failed to book show");
//         }
//       } else {
//         console.log("error in token:");
//         message.error(response.message);
//       }
//     } catch (err) {
//       console.log("error in response:");
//       message.error(err.message);
//     }
//   };

//   useEffect(() => {
//     getData();
//   }, []);
//   return (
//     <>
//       {show && (
//         <Row gutter={24}>
//           <Col span={24}>
//             <Card
//               title={
//                 <div className="movie-title-details">
//                   <h1>{show.movie.movieName}</h1>
//                   <p>
//                     Theatre: {show.theatre.name}, {show.theatre.address}
//                   </p>
//                 </div>
//               }
//               extra={
//                 <div className="show-name py-3">
//                   <h3>
//                     <span>Show Name:</span> {show.name}
//                   </h3>
//                   <h3>
//                     <span>Date & Time: </span>
//                     {moment(show.date).format("MMM Do YYYY")} at{" "}
//                     {moment(show.time, "HH:mm").format("hh:mm A")}
//                   </h3>
//                   <h3>
//                     <span>Ticket Price:</span> Rs. {show.ticketPrice}/-
//                   </h3>
//                   <h3>
//                     <span>Total Seats:</span> {show.totalSeats}
//                     <span> &nbsp;|&nbsp; Available Seats:</span>{" "}
//                     {show.totalSeats - show.bookedSeats.length}{" "}
//                   </h3>
//                 </div>
//               }
//               style={{ width: "100%" }}
//             >
//               {getSeats()}
//               {selectedSeats.length > 0 && (
//                 <StripeCheckout
//                   token={onToken}
//                   billingAddress
//                   amount={selectedSeats.length * show.ticketPrice * 100}
//                   stripeKey="pk_test_51QhyviKoC5CMR7XbjYwo36g2jM6Y2YnK5IzMZaflbCXWk6mOp2Pm883yReUiwfZuhFedoXS5Oxil1E8SStdpDpuh00ctMtMLzW"
//                 >
//                   {/* Use this one in some situation=> pk_test_eTH82XLklCU1LJBkr2cSDiGL001Bew71X8  */}
//                   <div className="max-width-600 mx-auto">
//                     <Button type="primary" shape="round" size="large" block>
//                       Pay Now
//                     </Button>
//                   </div>
//                 </StripeCheckout>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       )}
//     </>
//   );
// };
// export default BookShow;
