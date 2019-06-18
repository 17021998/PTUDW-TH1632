$(document).ready(function(){
    $("#sentComment").click(function(){
        var cmt = $("#ContentComment").val();
        var idP = <%=chitietbaiviet.ID%>;
        var ulCmt = document.getElementById('myList');
        var licmt = document.createElement('LI');
         licmt.setAttribute("class","media");
        // alert(licmt);
         ulCmt.appendChild(licmt);
        var acmt = document.createElement('a');
        acmt.setAttribute("class", "pull-left");
        licmt.appendChild(acmt);

        var img = document.createElement('img');
        img.setAttribute("class", "img-circle");
        <%if(!user){%>
            img.setAttribute("src", "https://bootdey.com/img/Content/user_1.jpg");
        <% } else { %>
            img.setAttribute("src", "<%=user.Photo%>");
        <%}%>
        acmt.appendChild(img);

        var div = document.createElement('DIV');
        div.setAttribute('class', 'media-body ml-4');
        licmt.appendChild(div);
        var strong = document.createElement('strong');
        strong.setAttribute("class", "text-success");
        div.appendChild(strong);
        <%if(!user){%>
            strong.innerHTML = "NoName"
        <% } else { %>
            strong.innerHTML = <%=user.FullName%>
        <%}%>
        var p = document.createElement('p');
        div.appendChild(p);
        p.innerHTML= cmt;
    });
});