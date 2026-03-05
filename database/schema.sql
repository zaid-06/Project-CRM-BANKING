-- Create database
CREATE DATABASE IF NOT EXISTS bankfinance_crm;
USE bankfinance_crm;

-- Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'staff', 'franchise') DEFAULT 'staff',
    department VARCHAR(50),
    avatar VARCHAR(10) DEFAULT 'U',
    status ENUM('active', 'inactive') DEFAULT 'active',
    lastLogin DATETIME,
    refreshToken TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leads table
CREATE TABLE IF NOT EXISTS Leads (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    loanType ENUM('Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan', 'Gold Loan') DEFAULT 'Personal Loan',
    amount DECIMAL(15,2) DEFAULT 500000,
    status ENUM('New', 'Contacted', 'Follow-up', 'Converted', 'Rejected') DEFAULT 'New',
    followup DATE,
    notes TEXT,
    assignedTo INT,
    createdBy INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignedTo) REFERENCES Users(id) ON DELETE SET NULL,
    FOREIGN KEY (createdBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Clients table
CREATE TABLE IF NOT EXISTS Clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    loanType ENUM('Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan', 'Gold Loan') DEFAULT 'Personal Loan',
    amount DECIMAL(15,2) DEFAULT 500000,
    status ENUM('Active', 'Inactive', 'Pending') DEFAULT 'Active',
    address TEXT,
    panNumber VARCHAR(20),
    aadharNumber VARCHAR(20),
    assignedTo INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignedTo) REFERENCES Users(id) ON DELETE SET NULL
);

-- Employees table
CREATE TABLE IF NOT EXISTS Employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    status ENUM('active', 'inactive', 'on-leave') DEFAULT 'active',
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    joiningDate DATE,
    salary DECIMAL(15,2),
    managerId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (managerId) REFERENCES Employees(id) ON DELETE SET NULL
);

-- Reminders table
CREATE TABLE IF NOT EXISTS Reminders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    client VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    notes TEXT,
    status ENUM('pending', 'completed', 'missed') DEFAULT 'pending',
    userId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Knowledge Base table
CREATE TABLE IF NOT EXISTS KnowledgeBases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    type ENUM('pdf', 'video', 'text') DEFAULT 'text',
    content TEXT NOT NULL,
    tags JSON,
    fileUrl VARCHAR(500),
    createdBy INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES Users(id) ON DELETE SET NULL
);

-- Commission table
CREATE TABLE IF NOT EXISTS Commissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product VARCHAR(100) NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    minAmount DECIMAL(15,2),
    maxAmount DECIMAL(15,2),
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- KYC table
CREATE TABLE IF NOT EXISTS KYCs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT UNIQUE,
    status ENUM('pending', 'in-progress', 'completed', 'rejected') DEFAULT 'pending',
    faceVerified BOOLEAN DEFAULT FALSE,
    documentsVerified BOOLEAN DEFAULT FALSE,
    locationVerified BOOLEAN DEFAULT FALSE,
    otpVerified BOOLEAN DEFAULT FALSE,
    faceImage VARCHAR(500),
    aadharImage VARCHAR(500),
    panImage VARCHAR(500),
    location JSON,
    completedAt DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- CIBIL table
CREATE TABLE IF NOT EXISTS CIBILs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    score INT NOT NULL,
    reportDate DATE NOT NULL,
    creditHistory INT,
    totalAccounts INT,
    activeAccounts INT,
    settledAccounts INT,
    delinquentAccounts INT,
    inquiries INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Issues table
CREATE TABLE IF NOT EXISTS Issues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('open', 'in-progress', 'resolved', 'closed') DEFAULT 'open',
    createdBy INT,
    assignedTo INT,
    resolvedAt DATETIME,
    resolution TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (createdBy) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES Users(id) ON DELETE SET NULL
);

-- Insert sample data
INSERT INTO Users (name, email, password, role, avatar) VALUES
('Admin User', 'admin@bankfinance.com', '$2a$10$YourHashedPasswordHere', 'admin', 'A'),
('Rajesh Kumar', 'manager@bankfinance.com', '$2a$10$YourHashedPasswordHere', 'manager', 'R'),
('Pooja Desai', 'staff@bankfinance.com', '$2a$10$YourHashedPasswordHere', 'staff', 'P'),
('Mumbai Franchise', 'franchise@bankfinance.com', '$2a$10$YourHashedPasswordHere', 'franchise', 'M');

INSERT INTO Employees (name, role, department, email) VALUES
('Rajesh Kumar', 'Loan Officer', 'Sales', 'rajesh@bankfinance.com'),
('Pooja Desai', 'Loan Officer', 'Sales', 'pooja@bankfinance.com');

INSERT INTO Leads (name, phone, email, loanType, amount, status, followup) VALUES
('Rahul Sharma', '+91 9876543210', 'rahul@email.com', 'Home Loan', 3500000, 'New', '2024-01-15'),
('Priya Patel', '+91 8765432109', 'priya@email.com', 'Personal Loan', 500000, 'Contacted', '2024-01-18'),
('Amit Kumar', '+91 7654321098', 'amit@email.com', 'Car Loan', 850000, 'Follow-up', '2024-01-12');

INSERT INTO Clients (name, phone, email, loanType, amount, status) VALUES
('Sneha Gupta', '+91 6543210987', 'sneha@email.com', 'Business Loan', 2500000, 'Active');

INSERT INTO Commissions (product, rate, minAmount, maxAmount) VALUES
('Home Loan', 0.8, 1000000, 10000000),
('Personal Loan', 1.5, 50000, 2500000),
('Business Loan', 1.2, 500000, 5000000),
('Car Loan', 1.0, 300000, 2000000),
('Gold Loan', 0.5, 50000, 1000000);
