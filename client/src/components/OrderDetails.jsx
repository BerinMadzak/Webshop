import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ShopContext } from "../main";
import OrderProduct from "./OrderProduct";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export default function OrderDetails() {
    const [order, setOrder] = useState(null);
    
    const { orderId } = useParams();
    const { account, setLoading } = useContext(ShopContext);

    const navigate = useNavigate();
    
    function totalPrice() {
        return order.reduce((accumulator, current) => accumulator + current.total_price, 0);
    }

    function orderToPDF() {
        const input = document.getElementById("order-display");
        html2canvas(input, {
            scale: 2,
            useCORS: true, 
            logging: true,
            letterRendering: true, 
          }).then((canvas) => {
            const doc = new jsPDF();
            const imgData = canvas.toDataURL('image/png');
      
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
      
            const imgWidth = pageWidth - 20; 
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
            let yPosition = 10;
      
            while (yPosition < canvas.height) {
              doc.addImage(
                imgData,
                'PNG',
                10,
                yPosition,
                imgWidth,
                imgHeight
              );
      
              if (yPosition + imgHeight > pageHeight) {
                doc.addPage(); 
                yPosition = 10;
              } else {
                break; 
              }
            }
      
            const fileName = account.username + "_#" + orderId + ".pdf";
            doc.save(fileName);
          }).catch((err) => {
            console.error('Error capturing the content:', err);
          });
    }

    useEffect(() => {
        if(!account) return;

        setLoading(true);
        fetch(`http://localhost:8080/order/${orderId}`)
        .then(res => res.json())
        .then(json => setOrder(json))
        .catch(err => console.log(err))
        .finally(setLoading(false));
    }, [orderId]);

    return (
        <div>
            <button onClick={() => navigate('/orders')} className="back">Back</button>
            <div id="order-display">
                <h1>Order #{orderId}</h1>
                <table className="cart-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Price</th>
                        <th>Total Price</th>
                    </tr>
                </thead>
                <tbody>
                {order &&
                    order.map(product => <OrderProduct product={product} key={product.product_id}/>)
                }
                </tbody>
                <tfoot>
                    <tr>
                        {order && <td colSpan={5}><p className="product-price">Total: {totalPrice()}</p></td>}
                    </tr>
                </tfoot>
                </table>
            </div>
            <button onClick={orderToPDF}><i className="fa-solid fa-file-pdf"> Download As PDF</i></button>
        </div>
    );
}