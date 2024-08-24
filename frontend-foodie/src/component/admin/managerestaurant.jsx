import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { restaurant } from "../../server";
import { useEffect } from "react";
import { useAppContext } from "../context";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import FoodieAnimation from "../foodieAnimation";

export const ManageRestaurants = () => {
  const go = useNavigate();
  axios.defaults.withCredentials = true;
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    async function getRes() {
      try {
        const { data } = await axios.get(`${restaurant}/admin-get`);
        dispatch({ type: "SET_ADMIN_RES", payload: data });
      } catch (error) {
        console.log(error);
      }
    }
    getRes();
  }, [dispatch]);

  async function DeleteRestaurant(id, username) {
    try {
      const confirmation = confirm(`do you want to delete ${username}??`);
      if (confirmation) {
        const { data } = await axios.delete(`${restaurant}/${id}`);
        alert(data.message);
        dispatch({ type: "SET_ADMIN_RES", payload: data.data });
      }
    } catch (error) {
      //console.log(error);
      alert(error.response.data.msg);
    }
  }

  if (!state.adminGetRestaurant) {
    return (
      <div>
        <FoodieAnimation />
      </div>
    );
  }

  return (
    <div className="dash-res">
      <div className="dash-res-center">
        <section className="create-restaurant-main">
          <h1
            onClick={() => {
              go("/admin/manageres/createres");
            }}
          >
            Create
          </h1>
          <span>{new Date().toLocaleDateString()}</span>
        </section>

        <section className="dash-res-center-det">
          {state.adminGetRestaurant &&
            state.adminGetRestaurant.map((data) => {
              return (
                <Link
                  to={`/admin/manageres/createresmenu/${data._id}`}
                  className="hover:scale-[1.01] active-scale-[.98] w-full grid grid-cols-4 shadow-md  pt-2 px-4"
                  key={data._id}
                >
                  <p className="translate-y-2 font-semibold text-sm sm:text-base md:text-lg">
                    {data.name}
                  </p>
                  <p className="translate-y-2 font-semibold text-sm md:text-base lg:text-lg">
                    {data.email}
                  </p>
                  <p className="translate-y-2 font-semibold text-sm md:text-base lg:text-lg">
                    {data.address}
                  </p>
                  <div className="flex gap-4 justify-end translate-y-2">
                    <AiOutlineDelete
                      className="hover:fill-red-500"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        DeleteRestaurant(data._id, data.name);
                      }}
                    />
                    <AiOutlineEdit
                      className=" hover:fill-yellow-700"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        go(`/admin/manageres/updateres/${data._id}`);
                      }}
                    />
                  </div>
                </Link>
              );
            })}
        </section>
      </div>
    </div>
  );
};
