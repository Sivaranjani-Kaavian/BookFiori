using bookshop from '../db/schema';

@path:'app'

service CatalogService {
    entity Books as projection on bookshop.Books;
    entity MigratedEntity as projection on bookshop.MigratedEntity;

    action migrateData(ID:Integer) //with an id make an migrations

    returns String;
}
