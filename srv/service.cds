using bookshop from '../db/schema';

@path:'app'

service CatalogService {
    entity Books as projection on bookshop.Books;
}
