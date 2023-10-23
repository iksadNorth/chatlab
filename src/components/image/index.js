import React, { useState } from "react";
import axios from "axios";

export default function Image(props) {
    const [image, setImage] = useState(0)

    const handleFileUploader = (event) => {
        setImage(event.target.files[0]);
    }

    const handlerSummitButton = (event) => {
        const formData = new FormData();
        formData.append('image', image);

        axios.put(
            'http://iksadnorth.kro.kr/api/auth/members/me/images', 
            formData,
            {
                headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiYXV0aCI6IlVTRVIiLCJleHAiOjMyNTA2MzU4NDAwLCJpYXQiOjE2OTc1MzA1MTl9.dbIJS-_gm0G8basRamd1uRCI_5iCZT_7b-3E9sUSBlU'
                }
            }
        )
        .then((res) => {alert(res.data.msg)})
        .catch((err) => {alert(err)})
    }

    return (
        <div>
            <input 
                type="file" 
                // accept="image/*"
                onChange={handleFileUploader}
            />

            <button
                onClick={handlerSummitButton}
            >
                전송
            </button>

            <div>
                { image.name }
            </div>
        </div>
    );
  }