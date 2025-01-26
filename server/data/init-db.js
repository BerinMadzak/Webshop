const db = require("./db")

// Queries
const dropTablesQuery = `
    DROP TABLE IF EXISTS Cart_Items;
    DROP TABLE IF EXISTS Carts;
    DROP TABLE IF EXISTS Users;
    DROP TABLE IF EXISTS Products;
    DROP TABLE IF EXISTS Categories;
`

const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS Categories (
        category_id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_category_id INTEGER,
        name TEXT NOT NULL UNIQUE,
        FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id)
    );

    CREATE TABLE IF NOT EXISTS Products (
        product_id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_id INTEGER,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        FOREIGN KEY (category_id) REFERENCES Categories(category_id)
    );

    CREATE TABLE IF NOT EXISTS Users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Carts (
        cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );

    CREATE TABLE IF NOT EXISTS Cart_Items (
        cart_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
        cart_id INTEGER,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (cart_id) REFERENCES Carts(cart_id),
        FOREIGN KEY (product_id) REFERENCES Products(product_id)
    );
`

const addDataQuery = `
    INSERT INTO Categories (name)
    VALUES ("Electronics"), ("Jewelery"), ("Men's Clothing"), ("Women's Clothing");

    INSERT INTO Products (category_id, name, description, price, image_url)
    VALUES
        (3, "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops", "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday", 109.95, "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"),
        (3, "Mens Casual Premium Slim Fit T-Shirts ", "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.", 22.3, 
        "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"),
        (3, "Mens Cotton Jacket", "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.", 55.99, "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"),
        (3, "Mens Casual Slim Fit", "The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should 
        be reviewed below on the product description.", 15.99, "https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"),
        (2, "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet", "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl. 
        Wear facing inward to be bestowed with love and abundance, or outward for protection.", 695, "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg"),
        (2, "Solid Gold Petite Micropave ", "Satisfaction Guaranteed. Return or exchange any order within 30 days.Designed and sold by Hafeez Center in the United States. Satisfaction Guaranteed. Return or exchange any order within 30 days.", 168, "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg"),
        (2, "White Gold Plated Princess", "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...", 9.99, "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg"),
        (2, "Pierced Owl Rose Gold Plated Stainless Steel Double", "Rose Gold Plated Double Flared Tunnel Plug Earrings. Made of 316L Stainless Steel", 10.99, "https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg"),
        (1, "WD 2TB Elements Portable External Hard Drive - USB 3.0 ", "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity; Compatibility Formatted NTFS for Windows 
        10, Windows 8.1, Windows 7; Reformatting may be required for other operating systems; Compatibility may vary depending on user’s hardware configuration and operating system", 64, "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg"),
        (1, "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s", "Easy upgrade for faster boot up, shutdown, application load and response (As compared to 5400 RPM SATA 2.5” hard drive; Based on published specifications and internal benchmarking tests using PCMark vantage scores) Boosts burst write performance, making it ideal for typical PC workloads The perfect balance of performance and reliability Read/write speeds of up to 535MB/s/450MB/s (Based on internal testing; Performance may vary depending upon drive capacity, host device, OS and application.)", 109, "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg"),
        (1, "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5", "3D NAND flash are applied to deliver high transfer speeds Remarkable transfer speeds that enable faster bootup and improved overall system performance. The advanced SLC Cache Technology allows performance boost and longer lifespan 7mm slim design suitable for Ultrabooks and Ultra-slim notebooks. Supports TRIM command, Garbage Collection technology, RAID, and ECC (Error Checking & Correction) to provide the optimized performance and enhanced reliability.", 109, "https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg"),
        (1, "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive", "Expand your PS4 gaming experience, Play anywhere Fast and easy, setup Sleek design with high capacity, 3-year manufacturer's limited warranty", 114, "https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg"),
        (1, "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin", "21. 5 inches Full HD (1920 x 1080) widescreen IPS display And Radeon free Sync technology. No compatibility for VESA Mount Refresh Rate: 75Hz - Using HDMI port Zero-frame design | ultra-thin | 4ms response time | IPS panel Aspect ratio - 16: 9. Color Supported - 16. 7 million colors. Brightness - 250 nit Tilt angle -5 degree to 15 degree. Horizontal viewing angle-178 degree. Vertical viewing angle-178 degree 75 hertz", 599, "https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg"),
        (1, "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED ", "49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR with dual 27 inch screen side by side QUANTUM DOT (QLED) TECHNOLOGY, HDR support and factory calibration provides stunningly realistic and accurate color and contrast 144HZ HIGH REFRESH RATE and 1ms ultra fast response time work to eliminate motion blur, ghosting, and reduce input lag", 999.99, "https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg"),
        (4, "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats", "Note:The Jackets is US standard size, Please choose size as your usual wear Material: 100% Polyester; Detachable Liner Fabric: Warm 
        Fleece. Detachable Functional Liner: Skin Friendly, Lightweigt and Warm.Stand Collar Liner jacket, keep you warm in cold weather. Zippered Pockets: 2 Zippered Hand Pockets, 2 Zippered Pockets on Chest (enough to keep cards or keys)and 1 Hidden Pocket Inside.Zippered Hand Pockets and Hidden Pocket keep your things secure. Humanized Design: Adjustable and Detachable Hood and Adjustable cuff to prevent the wind and water,for a comfortable fit. 3 in 1 Detachable Design provide more convenience, you can separate the coat and inner as needed, or wear it together. It is suitable for different season and help you adapt to different climates", 56.99, "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"),
        (4, "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket", "100% POLYURETHANE(shell) 100% POLYESTER(lining) 75% POLYESTER 25% COTTON (SWEATER), Faux leather material for style and comfort / 2 pockets of front, 2-For-One Hooded denim style faux leather jacket, Button detail on waist / Detail stitching at sides, HAND WASH ONLY / DO NOT BLEACH / LINE DRY / DO NOT IRON", 29.95, "https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg"),
        (4, "Rain Jacket Women Windbreaker Striped Climbing Raincoats", "Lightweight perfet for trip or casual wear---Long sleeve with hooded, adjustable drawstring waist design. Button and zipper front closure raincoat, fully stripes Lined and The Raincoat has 2 side pockets are a good size to hold all kinds of things, it covers the hips, and the hood is generous but doesn't overdo it.Attached Cotton Lined Hood with Adjustable Drawstrings give it a real styled look.", 39.99, "https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg"),
        (4, "MBJ Women's Solid Short Sleeve Boat Neck V ", "95% RAYON 5% SPANDEX, Made in USA or Imported, Do Not Bleach, Lightweight fabric with great stretch for comfort, Ribbed on sleeves and neckline / Double stitching on bottom hem", 9.85, "https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg"),
        (4, "Opna Women's Short Sleeve Moisture", "100% Polyester, Machine wash, 100% cationic polyester interlock, Machine Wash & Pre Shrunk for a Great Fit, Lightweight, roomy and highly breathable with 
        moisture wicking fabric which helps to keep moisture away, Soft Lightweight Fabric with comfortable V-neck collar and a slimmer fit, delivers a sleek, more feminine silhouette and Added Comfort", 7.95, "https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg"),
        (4, "DANVOUY Womens T Shirt Casual Cotton Short", "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.", 12.99, "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg"); 
        
        INSERT INTO Users (username, email, password_hash, first_name, last_name, phone_number, address)
        VALUES 
            ("Test", "test@test.com", "$2a$10$RmN6YXYTjxGB4FqzWUA9ouY2TC.0XLkB8oMXm1MZd.bpJ/kTtXaci", "First_Name", "Last_Name", "12345678", "Test Address");
`

// Query Execution
db.exec(dropTablesQuery, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Dropped all tables");
    }
});

db.exec(createTablesQuery, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Created all tables");
    }
});

db.exec(addDataQuery, (err) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Added data to tables");
    }
});

db.close();