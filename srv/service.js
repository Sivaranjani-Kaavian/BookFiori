// to handle migration data 

const cds = require('@sap/cds');
//implementing is an dummy wrapper.
module.exports = cds .service.impl(async function() {
    const { Books,MigratedEntity } = this.entities;
//here migrateData is an action name  and we giving an req to an id
    this.on('migrateData' , async (req) =>{
        const{ID} = req.data;
//getting an data from an Books entity
        const mainEntity = await SELECT.one.from(Books).where({ID});
        if(!mainEntity){
            return "Record not found";
        }
        await INSERT.into(MigratedEntity).entries({
            ID:mainEntity.ID,
            title:mainEntity.title,
            author:mainEntity.author,
            price:mainEntity.price,
            MigratedAt:new Date()
        });

        return "Data migrtaed Successfully";
    });
});
