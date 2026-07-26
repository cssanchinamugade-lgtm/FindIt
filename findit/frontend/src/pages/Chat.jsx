import { useParams } from "react-router-dom";

function Chat(){

    const {itemId, receiverId} = useParams();


    return(

        <div>

            <h1>
                Chat Page Opened 💬
            </h1>


            <p>
                Item ID: {itemId}
            </p>


            <p>
                Receiver ID: {receiverId}
            </p>


        </div>

    );

}


export default Chat;