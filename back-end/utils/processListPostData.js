module.exports = (posts) => {
    var arrPost = [];
    for (let i = 0; i < posts.length; i++) {
        var tag = {
            ID: posts[i].TagID,
            Name: posts[i].TagName
        };

        var post = {
            ID: posts[i].ID,
            Title: posts[i].Title,
            Abstract: posts[i].Abstract,
            Content: posts[i].Content,
            ImageAbstract: posts[i].ImageAbstract,
            ReleaseDay: posts[i].ReleaseDay,
            Premium: posts[i].Premium,
            Tags: []
        };
        if (tag.ID) {
            post.Tags.push(tag);
        }
        if (i === 0) {

            arrPost.push(post);
        } else {
            if (post.ID == arrPost[arrPost.length - 1].ID && tag.ID != null) {
                arrPost[arrPost.length - 1].Tags.push(tag);
            } else {
                arrPost.push(post);
            }
        }
    }

    return arrPost;
}