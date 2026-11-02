import categoryModel from '../models/categoryModel.js';

const categoryController = {
    async getAllCategories(req, res){
        try{
            const categories = await categoryModel.findAllCategories();
            return res.status(200).json({
                success: true,
                data: categories
            });
        }catch (error){
            console.error('Erreur lors de la récuperation des categories :', error);
            return res.status(500).json({
                success: false,
                message: "erreur interne du serveur lors de la récuperation des catégories."
            });
        }
    }
};

export default categoryController;