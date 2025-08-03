// This script creates circular favicons from your photo
// Run this in your browser's console after loading the page

function createCircularFavicon() {
    const sizes = [16, 32, 48, 64];
    
    sizes.forEach(size => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = function() {
            // Create circular clipping path
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2 - 1, 0, 2 * Math.PI);
            ctx.clip();
            
            // Draw image to fit the circle
            const imgSize = Math.min(img.width, img.height);
            const offsetX = (img.width - imgSize) / 2;
            const offsetY = (img.height - imgSize) / 2;
            
            ctx.drawImage(img, offsetX, offsetY, imgSize, imgSize, 0, 0, size, size);
            
            // Add subtle border
            ctx.globalCompositeOperation = 'source-over';
            ctx.beginPath();
            ctx.arc(size/2, size/2, size/2 - 1, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Download the favicon
            canvas.toBlob(function(blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `favicon-${size}x${size}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/png');
        };
        
        img.src = 'images/myphoto.jpg';
    });
}

// Create the favicons
createCircularFavicon();
