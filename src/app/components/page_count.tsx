import { float } from "../hooks/SizedBox";

type PageCount = {
    currentPage: float;
    totalPages: float
}

const PageCount: React.FC<PageCount> =  ({ currentPage, totalPages }) => {
    return <>
        <div>
            {Array.from({ length: totalPages }, (_, index) => (
                <span
                    key={index}
                    className={`inline-block w-2 h-2 rounded-full mx-1 ${currentPage === index ? 'bg-blue-500' : 'bg-gray-300'}`}
                ></span>
            ))}
        </div>
    </>
}

export default PageCount;