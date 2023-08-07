using {my.registration as db} from '../db/employee-sr';

service CatalogService @(path: '/CatalogService') {

    entity Employees  as projection on db.Employees;
    entity Department as projection on db.Department;
    entity Project    as projection on db.Project;
     entity Country    as projection on db.Country;
}
