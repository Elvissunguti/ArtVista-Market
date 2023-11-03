import React from "react";
import { BsTrash3 } from "react-icons/bs";
import { useCartList } from "../Context/CartListContext";
import { makeAuthenticatedPOSTRequest } from "../Utils/Helpers";

const CartListCard = ({ title, artist, artType, price, artPhoto, artWorkId }) => {

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
    


    const artPhotoFilename = artPhoto.split("\\").pop();
    const artPhotoUrl = `/ArtImages/${artPhotoFilename}`; 

    return(
        <section>
            <div>
                <div className="flex ">
                    <div>
                        <img 
                           src={artPhotoUrl}
                           alt="image of artwork"
                           className="h-48 w-48"
                        />
                        <button onClick={deleteCartList}>
                        <BsTrash3 />
                        </button>
                    </div>
                    <div>
                        <p className="text-xl font-medium ">{title}</p>
                        <p>artist</p>
                        <p>{artType}</p>
                        <p>Artwork Total ${price}</p>
                    </div>
                </div>

            </div>
        </section>
    )
}
export default CartListCard;