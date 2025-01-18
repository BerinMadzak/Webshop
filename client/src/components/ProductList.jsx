import Product from "./Product";

export default function ProductList({products}) {
    return (
        <div className="product-list">
            {products &&
                products.map((product) => <Product product={product} key={product.product_id}/>)
            }
        </div>
    );
}