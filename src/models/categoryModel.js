import pool from '../db.js';


const categoryModel = {
    async findAllCategories(){
        const query = 'SELECT * FROM categories';
        const result = await pool.query(query)
        return result.rows;
    }
};

export default categoryModel;