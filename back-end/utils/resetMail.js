module.exports = (token) => {
    return `
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <style>
        .tooltip {
            position: relative;
            display: inline-block;
        }

        .tooltip .tooltiptext {
            visibility: hidden;
            width: 140px;
            background-color: #555;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 150%;
            left: 50%;
            margin-left: -75px;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .tooltip .tooltiptext::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #555 transparent transparent transparent;
        }

        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
    </style>
</head>

<body>
    <center class="card">
        <h3>Có vẻ bạn vừa yêu cầu lấy lại mật khẩu?</h3>
        <p>Bạn vừa yêu cầu đặt lại <strong>Mật khẩu</strong> cho tài khoản báo điện thử <b>th16news</b>. <br /> Đây là mã
            xác thực:</p>
        <h1>${token}</h1>
        <p>Nếu bạn không gửi yêu cầu này, tài khoản của bạn có thể đã bị một người khác sử dụng. Trong
            trường hợp đó, hãy liên
            lạc với Đội ngũ của chúng tôi để hộ trợ bạn.</p>
        <p>
            Trân Trọng, <br />
            th16news Team
            18009999
        </p>
    </center>
</body>`;
}