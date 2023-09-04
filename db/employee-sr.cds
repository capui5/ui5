namespace my.registration;

entity Employees {
        @title: 'Employee ID'
    key ID         : Integer;

        @title: 'First Name'
        fname      : String(100);

        @title: 'Last Name'
        lname      : String(100);

        @title: 'Designation'
        desig      : String(100);

        @title: 'Email'
        email      : String(100);

        @title: 'Skills'
        skills     : String;

        @title: 'Country'
        country    : Association to Country;

        @title: 'State'
        State      : String;

        @title: 'City'
        city       : String;

        @title: 'Date of Joining'
        doj        : Date;

        @title: 'Years of experience'
        yoe        : Integer;

        @title: 'Gender'
        gender     : String;

        @title: 'Department'
        department : Association to Department;

        @title: 'Projects'
        projects   : Association to Project;

        // @title: 'Leave Status'
        // onleave   : Association to OnLeave;

        @title : 'Leave'
        leave :Boolean;

        @title : 'Reporting Person'
        reportingPerson : String;

        @title : 'Phone Number'
        Phno: Integer;
}

entity Department {
        @title: 'Department ID'
    key ID        : Integer;

        @title: 'Department Name'
        name      : String;

        @title: 'Country'
        country   : String;

        @title: 'State'
        state     : String;

        @title: 'City'
        city      : String;

        @title: 'Employee Name'
        employees : Association to many Employees
                        on employees.department = $self;
}

entity Project {
        @title: 'Project ID'
    key ID        : Integer;

        @title: 'Project Name'
        name      : String;

        @title: 'Working Hours'
        workhrs   : Integer;

        @title: 'Employee Name'
        employees : Association to many Employees
                        on employees.projects = $self;
}

entity Country {
        @title: 'Country'
    key ID        : Integer;

        name      : String;

        employees : Association to many Employees
                        on employees.country = $self;

}

// entity OnLeave {
//     @title: 'OnLeave'
//     name : Boolean;
//     employees : Association to many Employees
//                     on employees.onleave = $self;
// }
