import {
  Col,
  Modal,
  Row,
  Form,
  Input,
  Button,
  Select,
  Table,
  message,
} from "antd";

import { ShowLoading, HideLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState, useCallback } from "react";
import { getAllMovies } from "../../api/movies";
import {
  addShow,
  deleteShow,
  getShowsByTheatre,
  updateShow,
} from "../../api/shows";
import moment from "moment";

const ShowModal = ({
  isShowModalOpen,
  setIsShowModalOpen,
  selectedTheatre,
}) => {
  const [view, setView] = useState("table"); // view can be table, add, edit
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const dispatch = useDispatch();

  // Memoized getData function
  const getData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const movieResponse = await getAllMovies();
      console.log("Movies API Response:", movieResponse);
      if (movieResponse.success) {
        setMovies(movieResponse.data);
        console.log("Movies in state:", movies); // This will correctly update the state
      } else {
        setMovies([]); 
        message.error(movieResponse.message);
      }
  
      const showResponse = await getShowsByTheatre({
        theatreId: selectedTheatre._id,
      });
      if (showResponse.success) {
        setShows(showResponse.data);
      } else {
        message.error(showResponse.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      message.error(err.message || "Something went wrong!");
      dispatch(HideLoading());
    }
  }, [dispatch, selectedTheatre]);
  ;

  useEffect(() => {
    if (isShowModalOpen) {
      getData();
    }
  }, [getData, isShowModalOpen]);

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const payload = {
        ...values,
        theatre: selectedTheatre._id,
      };
      const response =
        view === "add"
          ? await addShow(payload)
          : await updateShow({
              ...payload,
              showId: selectedShow._id,
            });
      if (response.success) {
        message.success(response.message);
        setView("table");
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      message.error(err.message || "Something went wrong!");
      dispatch(HideLoading());
    }
  };

  const handleDelete = async (showId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteShow({ showId });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (err) {
      message.error(err.message || "Something went wrong!");
      dispatch(HideLoading());
    }
  };

  const handleCancel = () => {
    setIsShowModalOpen(false);
    setView("table");
  };

  const columns = [
    {
      title: "Show Name",
      dataIndex: "name",
    },
    {
      title: "Show Date",
      dataIndex: "date",
      render: (text) => moment(text).format("MMM Do YYYY"),
    },
    {
      title: "Show Time",
      dataIndex: "time",
      render: (text) => moment(text, "HH:mm").format("hh:mm A"),
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (_, record) => record.movie ? record.movie.name : "N/A",
    },
    {
      title: "Ticket Price",
      dataIndex: "ticketPrice",
    },
    {
      title: "Total Seats",
      dataIndex: "totalSeats",
    },
    {
      title: "Available Seats",
      dataIndex: "seats",
      render: (_, record) => record.totalSeats - record.bookedSeats.length,
    },
    {
      title: "Action",
      render: (_, record) => (
        <div className="d-flex gap-10">
          <Button
            onClick={() => {
              setView("edit");
              setSelectedMovie(record.movie);
              setSelectedShow({
                ...record,
                date: moment(record.date).format("YYYY-MM-DD"),
              });
            }}
          >
            <EditOutlined />
          </Button>
          <Button onClick={() => handleDelete(record._id)}>
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Modal
      centered
      title={selectedTheatre.name}
      open={isShowModalOpen}
      onCancel={handleCancel}
      width={1200}
      footer={null}
    >
      <div className="d-flex justify-content-between">
        <h3>
          {view === "table"
            ? "List of Shows"
            : view === "add"
            ? "Add Show"
            : "Edit Show"}
        </h3>
        {view === "table" && (
          <Button type="primary" onClick={() => setView("add")}>
            Add Show
          </Button>
        )}
      </div>

      {view === "table" && <Table dataSource={shows} columns={columns} />}

      {(view === "add" || view === "edit") && (
        <Form
          layout="vertical"
          initialValues={view === "edit" ? selectedShow : null}
          onFinish={onFinish}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Show Name"
                name="name"
                rules={[{ required: true, message: "Show name is required!" }]}
              >
                <Input placeholder="Enter show name" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Show Date"
                name="date"
                rules={[{ required: true, message: "Show date is required!" }]}
              >
                <Input type="date" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Show Time"
                name="time"
                rules={[{ required: true, message: "Show time is required!" }]}
              >
                <Input type="time" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Select Movie"
                name="movie"
                rules={[{ required: true, message: "Movie is required!" }]}
              >
                
                <Select
                  placeholder="Select Movie"
                  options={
                    Array.isArray(movies)
                      ? movies.map((movie) => ({
                          value: movie._id,
                          label: movie.name,
                        }))
                      : []
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Ticket Price"
                name="ticketPrice"
                rules={[
                  { required: true, message: "Ticket price is required!" },
                ]}
              >
                <Input type="number" placeholder="Enter ticket price" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Total Seats"
                name="totalSeats"
                rules={[
                  { required: true, message: "Total seats are required!" },
                ]}
              >
                <Input type="number" placeholder="Enter total seats" />
              </Form.Item>
            </Col>
          </Row>
          <div className="d-flex gap-10">
            <Button onClick={() => setView("table")}>
              <ArrowLeftOutlined /> Go Back
            </Button>
            <Button type="primary" htmlType="submit">
              {view === "add" ? "Add Show" : "Edit Show"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default ShowModal;
