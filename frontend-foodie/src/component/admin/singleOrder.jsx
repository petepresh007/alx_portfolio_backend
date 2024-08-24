import { useParams } from "react-router-dom";
import { useAppContext } from "../context";
import { useEffect } from "react";
import { order, url } from "../../server";
import axios from "axios";
import FoodieAnimation from "../foodieAnimation";

export const SingleOrder = () => {
  const { id } = useParams();
  const { state, dispatch } = useAppContext();

  //confirm order
  async function confirmOrder(id) {
    try {
      const { data } = await axios.put(`${order}/approver-user-order/${id}`);
      alert(data.msg);
      dispatch({ type: "SET_ADMIN_ORDER", payload: data.data });
    } catch (error) {
      alert(error.response.data.msg);
    }
  }

  //confirm delivery
  async function confirmDelivery(id) {
    try {
      const { data } = await axios.put(`${order}/delivered/${id}`);
      alert(data.msg);
      dispatch({ type: "SET_ADMIN_ORDER", payload: data.data });
    } catch (error) {
      alert(error.response.data.msg);
    }
  }

  useEffect(() => {
    async function getOrders() {
      try {
        const { data } = await axios.get(`${order}/all`);
        dispatch({ type: "SET_ADMIN_ORDER", payload: data });
      } catch (error) {
        console.log(error);
      }
    }
    getOrders();
  }, [dispatch]);

  const choiceOrder =
    state.adminGetOrders &&
    state.adminGetOrders.find((data) => data._id === id);

  console.log(choiceOrder);

  if (!choiceOrder) {
    return (
      <div>
        <FoodieAnimation />
      </div>
    );
  }

  if (!state.adminGetOrders) {
    return (
      <div>
        <FoodieAnimation />
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="res-order bg-gray-200 pb-4 rounded-md min-w-[290px] max-w-[500px] ">
        <div className="w-[100%] flex justify-center rounded-md rounded-b-none">
          {choiceOrder.items[0].menuItem ? (
            <img
              className="rounded-[inherit] w-[full]"
              src={`${url}/upload/${choiceOrder.items[0].menuItem.file}`}
              alt="order"
            />
          ) : (
            "No file is associated with the selected item"
          )}
        </div>
        <div className="font-medium bg-red-800 text-white p-1 px-6 pt-4">
          <p className='grid grid-cols-2'>
            Order ID:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">{choiceOrder._id}</span>
          </p>
          <p className='grid grid-cols-2'>
            Name:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.user.name}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Email:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.user.email}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Phone Number:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.user.phoneNumber
                ? choiceOrder.user.phoneNumber
                : "None"}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Quantity:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.quantity}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Restaurant:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.restaurant
                ? choiceOrder.restaurant.name
                : "No restaurant"}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Item:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.items[0].menuItem.name}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Price:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              &#8358;{choiceOrder.items[0].menuItem.price}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Order date:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.orderDate}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Pack:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.pack}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Payment:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.paymentStatus}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Mode of Payment:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.paymentMethod}
            </span>
          </p>
          <p className='grid grid-cols-2'>
            Order Status:{" "}
            <span className=" text-xs md:text-base lg:text-lg capitalize self-center text-gray-300 font-bold">
              {choiceOrder.status}
            </span>
          </p>
        </div>
        
          <div
            role="button"
            className=" text-center p-2 active:scale-[.98] font-semibold text-white bg-yellow-500" 
            onClick={() => confirmOrder(choiceOrder._id)}>
            Confirm Order
          </div>

          <div
            role="button"
            className="  text-center p-2 active:scale-[.98] font-semibold text-white bg-green-800"
            onClick={() => confirmDelivery(choiceOrder._id)}>
            Confirm Order Delivery
          </div>
      </div>
    </div>
  );
};
