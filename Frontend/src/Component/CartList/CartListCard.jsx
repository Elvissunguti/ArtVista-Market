import React from "react";
import { BsTrash3 } from "react-icons/bs";
import { useCartList } from "../Context/CartListContext";
import { makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import { Tooltip } from "react-tippy";

const CartListCard = ({ title, userName, artType, price, artPhoto, artWorkId }) => {

    const { cartListNumber, updatedCartListNumber } = useCartList();

    const deleteCartList = async (artWorkId) => {
        try{
    
          const response = await makeAuthenticatedPOSTRequest(
            `/cartList/deletecartlist/${artWorkId}`
          );
          if(response.error){
            console.error("Error deleting from cart list:", response.error);
          };
    
          updatedCartListNumber(cartListNumber - 1);
    
        } catch (error) {
          console.log('Error deleting from cart list', error);
        }
      };
    


 

    return(
      <section>
      <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg">
        <div>
          <img 
            src={artPhoto}
            alt={`${title} by ${userName}`}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        <div className="ml-4">
          <p className="text-xl font-medium mb-2">{title}</p>
          <p className="text-sm text-gray-600">By {userName}</p>
          <p className="text-sm text-gray-600">{artType}</p>
          <p className="text-sm text-gray-600">Artwork Total ${price}</p>
        </div>
        <button 
          onClick={() => deleteCartList(artWorkId)}
          className="font-semibold text-2xl text-red-500 hover:text-red-700 focus:outline-none"
        >
          <Tooltip title="Remove from Cart" position="right">
          <BsTrash3 />
          </Tooltip>
        </button>
      </div>
    </section>
    )
}
export default CartListCard;