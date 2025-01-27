import Product from "./Product";

export default function ProductList({products, handleAdd}) {
    return (
        <div className="product-list">
            {products &&
                products.map((product) => <Product product={product} key={product.product_id} handleAdd={handleAdd}/>)
            }
        </div>
    );
}