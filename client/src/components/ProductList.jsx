import Product from "./Product";

export default function ProductList({products}) {
    return (
        <div>
            {products &&
                products.map((product) => <Product product={product} key={product.product_id}/>)
            }
        </div>
    );
}