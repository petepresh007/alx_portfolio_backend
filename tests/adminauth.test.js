const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../server");
const User = require('../models/Admin');
const mongoose = require('mongoose');


const { expect } = chai;
chai.use(chaiHttp);
const dbName = "fooddb";
const url = `${process.env.MONGO_URI}/${dbName}`;


describe('Auth Routes', () => {
    before(async () => {
        // Connect to the database before running tests
        await mongoose
            .connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
    });

    beforeEach(async () => {
        // Clear the User collection before each test
        await User.deleteMany({});
    });

    after(async () => {
        // Close the database connection after running tests
        await mongoose.connection.close();
    });

    describe('POST /api/adminauth/register', () => {
        it('should register a new user and set a cookie', async () => {
            const res = await chai.request(server)
                .post('/api/adminauth/register')
                .send({
                    name: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('user').eql('testuser');
            expect(res).to.have.cookie('admintoken');
        });

        it('should return an error if the email already exists', async () => {
            const user = new User({
                name: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
            await user.save();

            const res = await chai.request(server)
                .post('/api/adminauth/register')
                .send({
                    name: 'testuser',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res).to.have.status(409);
            expect(res.body).to.have.property('msg').eql('email already exists. enter another email');
        });

        it('should return an error if any field is missing', async () => {
            const res = await chai.request(server)
                .post('/api/adminauth/register')
                .send({
                    name: 'testuser',
                    email: 'test@example.com'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('msg').eql('all fields are required...');
        });
    });

    //login routes..........
    describe('POST /api/adminauth/login', () => {
        it('should return an error if the email is not valid', async () => {
            const res = await chai.request(server)
                .post('/api/adminauth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('msg').eql('Invalid Credentials');
        });

        it('should return an error if any field is missing', async () => {
            const res = await chai.request(server)
                .post('/api/adminauth/login')
                .send({
                    name: 'testuser',
                    email: 'test@example.com'
                });

            expect(res).to.have.status(400);
            expect(res.body).to.have.property('msg').eql('All fields are required...');
        });
    });
});