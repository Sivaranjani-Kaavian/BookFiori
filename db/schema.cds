namespace bookshop;
entity Books {
    key ID     : Integer;
    title      : String;
    author     : String;
    price      : Decimal;
}
entity MigratedEntity {
    key ID     : Integer;
    title      : String;
    author     : String;
    price      : Decimal;
    MigratedAt     : Timestamp;
}
