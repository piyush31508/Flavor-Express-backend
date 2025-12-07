import { Product } from '../model/product.js';
//
export const createProduct = async (req,res) => {
    try {
        const {  title, description, price, discountPercentage, rating, category, thumbnail, images }  = req.body;

        const product = new Product({ title, description, price, discountPercentage, rating, category, thumbnail, images });
        await product.save();

        res.status(201).json({ message: "Product saved successfully", product });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const maxProductPerPage = 12;
        const page = parseInt(req.query.page) || 1;
        const totalProducts = await Product.countDocuments();
        const products = await Product.find()
            .skip(maxProductPerPage * (page - 1))
            .limit(maxProductPerPage);

        res.json({ products, totalProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const product = await Product.findByIdAndUpdate(id, updates, { new: true });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}


export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = 12;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search query (q) is required" });
    }

    const regex = new RegExp(q, 'i');

    const filter = {
      $or: [
        { title: regex },
        { description: regex },
        { category: regex },
      ],
    };

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//addProductReview, getPaginatedProducts/lazyLoadingProduct, searchProducts, filterProducts will be adding these
//later currently a basic structure will be sufficent 