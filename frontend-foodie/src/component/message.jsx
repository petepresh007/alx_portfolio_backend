import { useEffect } from "react";
import { notification } from "../server";
import axios from "axios";
import { useAppContext } from "../component/context";
import FoodieAnimation from "./foodieAnimation";

export const Message = () => {
  axios.defaults.withCredentials = true;
  const { state, dispatch } = useAppContext();

  const getTypeColor = (type) => {
    switch (type) {
      case "order_delivered":
        return "text-green-500";
      case "order_deleted":
        return "text-red-600";
      default:
        return "text-orange-600";
    }
  };

  useEffect(() => {
    async function notReadNotification() {
      try {
        const { data } = await axios.get(`${notification}/not-read-yet`);
        dispatch({ type: "SET_UNREAD", payload: data });
      } catch (error) {
        console.log(error);
      }
    }
    notReadNotification();
  }, []);

  useEffect(() => {
    async function getNotification() {
      try {
        const { data } = await axios.get(`${notification}`);
        dispatch({ type: "SET_NOTIFICATON", payload: data });
      } catch (error) {
        console.log(error);
      }
    }
    getNotification();
  }, []);

  async function readNotification(id) {
    try {
      const { data } = await axios.put(
        `${notification}/read-notification/${id}`
      );
      dispatch({ type: "SET_NOTIFICATON", payload: data.read });
      dispatch({ type: "SET_UNREAD", payload: data.notRead });
      //console.log(data)
    } catch (error) {
      alert(error.response.data.msg);
    }
  }

  if (!state.notification) {
    return (
      <div>
        <FoodieAnimation />
      </div>
    );
  }

  if (!state.unreadNotification) {
    return (
      <div>
        <FoodieAnimation />
      </div>
    );
  }

  return (
    <div className="notification">
      <div className="notification-center shadow-md">
        {state.notification &&
          state.notification.map((data) => {
            return (
              <div
                key={data._id}
                className={`notification-center-det ${
                  data.isRead ? "read-message" : ""
                } shadow-md`}
              >
                <div
                  onClick={() => readNotification(data._id)}
                  className="clickable"
                >
                  <div>
                    <h3>
                      <span className="font-medium pr-1">Email: </span>
                      {data.user.email}
                    </h3>
                  </div>
                  <p>
                    Hi <span className="font-bold">{data.user.name}</span>,
                  </p>
                  <p className="text-sm sm:text-base">{data.message}</p>
                  <em className={`font-medium ${getTypeColor(data.type)}`}>{data.type}</em>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
