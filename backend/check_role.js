import PocketBase from 'pocketbase'

const pb = new PocketBase('http://127.0.0.1:8090')

async function updateRule() {
    await pb.admins.authWithPassword('gajendrasin18@gmail.com', 'admin1234567890')
    const users = await pb.collection('users').getFullList()
    console.log(users.map(u => ({ email: u.email, role: u.role })))
}
updateRule()
