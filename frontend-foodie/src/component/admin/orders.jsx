import axios from "axios";
import { useEffect } from "react";
import { useAppContext } from "../context";
import { order } from "../../server";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate, Link} from "react-router-dom";

export const OrderPage = () => {
  const { state, dispatch } = useAppContext();
  const go = useNavigate();

  //deleteorder
  async function del(id) {
    try {
      const confirmation = confirm("Do you want to delete this order?");
      if (confirmation) {
        const { data } = await axios.delete(`${order}/del/${id}`);
        dispatch({ type: "SET_ADMIN_ORDER", payload: data.data });
      }
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

  return (
    <div className="w-full mt-4 space-y-8">
      <h1 className="font-semibold text-center text-lg md:text-2xl">
        Users&apos; <span className="pl-2">Orders</span>
      </h1>
      <div className="space-y-4">
        {state.adminGetOrders &&
          state.adminGetOrders.map((data) => {
            return (
              <Link to={`/admin/manageorders/order/${data._id}`} key={data._id} className="cursor-pointer w-full flex justify-between font-medium capitalize shadow-md px-2">
                <p
                className="translate-y-2 text-xs sm:text-base lg:text-lg"
                style={{ cursor: "pointer" }}
                >
                  id: {data._id}
                </p>

                <p className="translate-y-2 text-xs sm:text-base lg:text-lg">payment: {data.paymentMethod}</p>
                <p className="translate-y-2 text-xs sm:text-base lg:text-lg">Payment status: {data.paymentStatus}</p>
                <p className="translate-y-2 text-xs sm:text-base lg:text-lg">status: {data.status}</p>
                <AiOutlineDelete className="cursor-pointer h-8 translate-y-2 hover:fill-red-500" 
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    del(data._id)
                    }} />
              </Link>
            );
          })}
      </div>
    </div>
  );
};
