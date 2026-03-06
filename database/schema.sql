-- Create database
CREATE DATABASE IF NOT EXISTS bankfinance_crm;
USE bankfinance_crm;

-- Users table (lowercase to match Sequelize tableName: "users")
CREATE TABLE IF NOT EXISTS users (
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
    otp VARCHAR(6),
    otpExpires DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Leads table (Sequelize default "Leads")
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
    FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
);

-- Clients table (Sequelize tableName: "clients")
-- Uses slug enums for loanType and lowercase status to match Client model
CREATE TABLE IF NOT EXISTS clients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    loanType ENUM('home_loan', 'personal_loan', 'business_loan', 'car_loan', 'gold_loan') DEFAULT 'personal_loan',
    amount DECIMAL(15,2) DEFAULT 500000,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    address TEXT,
    panNumber VARCHAR(20),
    aadharNumber VARCHAR(20),
    assignedTo INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL
);

-- Employees table (Sequelize tableName: "employees")
CREATE TABLE IF NOT EXISTS employees (
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
    FOREIGN KEY (managerId) REFERENCES employees(id) ON DELETE SET NULL
);

-- Reminders table (Sequelize default "Reminders")
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
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
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
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
);

-- Commission table (Sequelize tableName: "commissions")
CREATE TABLE IF NOT EXISTS commissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product VARCHAR(100) NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    minAmount DECIMAL(15,2),
    maxAmount DECIMAL(15,2),
    description TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- KYC table (Sequelize tableName: "kyc")
CREATE TABLE IF NOT EXISTS kyc (
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
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- CIBIL table (Sequelize tableName: "cibil")
CREATE TABLE IF NOT EXISTS cibil (
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
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Issues table (Sequelize tableName: "issues")
CREATE TABLE IF NOT EXISTS issues (
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
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignedTo) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample data (no users/clients - backend bootstraps admin; clients will be created via app)
INSERT INTO employees (name, role, department, email) VALUES
('Rajesh Kumar', 'Loan Officer', 'Sales', 'rajesh@bankfinance.com'),
('Pooja Desai', 'Loan Officer', 'Sales', 'pooja@bankfinance.com');

INSERT INTO commissions (product, rate, minAmount, maxAmount) VALUES
('Home Loan', 0.8, 1000000, 10000000),
('Personal Loan', 1.5, 50000, 2500000),
('Business Loan', 1.2, 500000, 5000000),
('Car Loan', 1.0, 300000, 2000000),
('Gold Loan', 0.5, 50000, 1000000);
