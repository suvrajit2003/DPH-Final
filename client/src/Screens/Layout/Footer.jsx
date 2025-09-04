import React from 'react'

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <React.Fragment>
            <footer className="footer bg-white shadow text-[#7f8296] px-5 py-4 mb-4">
                <div className="container mx-auto">
                    <div className="flex justify-between">
                        <div className="md:w-1/2 text-center md:text-left mb-4 md:mb-0">
                            {currentYear} © <span className='text-[#2E3A8C]'>
                                  Directorate of Public Health, Bhubaneswar, Orissa
                            </span>.
                        </div>
                        <div className="md:w-1/2 text-center md:text-right">
                            <div className="text-sm d-none d-sm-block">
                                Design & Develop by
                                <a
                                    href=" https://mindtrack.tech"
                                    target='blank'
                                    className="ms-1 underline text-green-700">
                                    Mindtrack
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </React.Fragment>
    )
}

export default Footer
