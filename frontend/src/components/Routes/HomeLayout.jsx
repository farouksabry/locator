import NavBar from '../Navbar/NavBar';
import Footer from '../Footer/Footer';

export default function HomeLayout({children}) {

    return (
        <div className='d-flex flex-column min-vh-100'>
            <NavBar />
            <main className='flex-grow-1'>
                {children}
            </main>
            <Footer />
        </div>
    )
}