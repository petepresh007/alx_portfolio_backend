import axios from "axios";
import { menu, url } from "../server";
import { useAppContext } from "../component/context";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FoodieAnimation from "../component/foodieAnimation";

export const Menu = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState(true);
  const go = useNavigate();

  useEffect(() => {
    async function getMenu() {
      try {
        const { data } = await axios.get(`${menu}/all`);
        //console.log(data)
        dispatch({ type: "SET_MENU", payload: data });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    getMenu();
  }, [dispatch]);

  if (!state.menu) {
    return <div>loading...</div>;
  }

  if (loading) {
    return (
      <div>
        <FoodieAnimation />
      </div>
    );
  }

  return (
    <div className="menu-item-block">
      <h1 className=" text-xl font-bold mb-4">Available Menu</h1>
      <section className="px-2 max-w-6xl mx-auto grid gap-6 lg:gap-12 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center">
        {state.menu &&
          state.menu.map((data) => {
            return (
              <div
                className="lg:hover:scale-[1.05] hover:shadow-xl shadow-gray-700 duration-300 cursor-pointer w-full max-w-[300px] border border-gray-300 bg-orange-500 rounded-md overflow-hidden"
                key={data._id}
                onClick={() => {
                  go(`/selected-menu/${data._id}`);
                }}
              >
                <img
                  className="w-full h-32 md:h-48 object-cover"
                  src={`${url}/upload/${data.file}`}
                  alt=""
                />
                <div className="p-2 lg:pt-2 lg:pb-4 px-4">
                  <p className="text-center text-sm sm:text-base lg:text-lg text-white font-semibold capitalize tracking-wider">
                    {data.name}
                  </p>
                  <button className="self-end font-[Roboto]  w-full bg-white text-orange-500 text-base font-bold rounded-md lg:hover:bg-white/90 lg:hover:text-green-800 transition duration-300">
                    Checkout
                  </button>
                </div>
              </div>
            );
          })}
      </section>
    </div>
  );
};
