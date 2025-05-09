import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getChapters } from "../../../../api/chapterApi";
import Grid from "../../../../components/Grid";
import LoadingData from "../../../../components/Loading/LoadingData";   
import Pagination from "../../../../components/Pagination/index";
import { routeLink } from "../../../../routes/AppRoutes";
import Chapter from "../../../../components/Chapter/index";

export const ChapterTab = (props) => {
    const [chapters, setChapters] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalChapters, setTotalChapters] = useState(0);

    const url = props.url;
    useEffect(() => {
        const loadList = async () => {
            const params = {
                url: props.url,
                page: currentPage-1,
                size: 2,
            };

            getChapters(params).then((res) => {
                // console.log(res);
                setChapters(res?.data.content || []);
                setTotalPages(res.data.totalPages);
                setTotalChapters(res.data.totalElements);
                // console.log("totalChapters: " + totalChapters);
                setLoadingData(false);
            });
        };
        loadList(); //gọi hàm
    }, [props.url, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    return (
        <>
            <h3>Danh sách chương</h3>
            {loadingData ? (
                <LoadingData />
            ) : (
                <Grid gap={15} col={props.col || 3} snCol={1}>
                    {chapters.map((item, index) => {
                        return (
                            <Chapter key={index} chapter={item} />
                        );
                    })}
                </Grid>
            )}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
            />
        </>
    );
};