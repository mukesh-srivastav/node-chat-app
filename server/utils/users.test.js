const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
	
	var users;
	beforeEach(()=> {
		users = new Users();
		users.users = [{
			id:'1',
			name:'Mike',
			room: 'Node Course'
		}, {
			id:'2',
			name:'Alice',
			room: 'React Course'
		}, {
			id:'3',
			name:'Bob',
			room: 'Mongo Course'
		}];
	});

	it('should add new user', () => {
		var users = new Users();

		var user = {
			id: '123',
			name: 'Mike',
			room: 'The office Fans'
		};

		var resUser = users.addUser(user.id, user.name, user.room);
		expect(users.users).toEqual([user]);
	});


	it('should remove a user', () => {
		var userId = '1';
		var user = users.removeUser(userId);

		expect(user.id).toBe(userId);
		expect(users.users.length).toBe(2);
	});

	it('should not remove user', () => {
		var userId = '4';
		var user = users.removeUser(userId);

		expect(user).toNotExist();
		expect(users.users.length).toBe(3);

	});

	it('should find user', () => {
		var userId = '2';
		var user = users.getUser(userId);

		expect(user.id).toBe(userId);
		expect(user.name).toBe('Alice');
		expect(user.room).toBe('React Course');
	});

	it('should not find user', () => {
		var userId = '4';
		var user = users.getUser(userId); ////returns undefiend

		expect(user).toNotExist(); 
	});

	it('should return names for node course', () => {
		var userList = users.getUsersList('Mongo Course');

		expect(userList).toEqual(['Bob']);
	});
});