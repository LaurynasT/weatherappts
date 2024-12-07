export interface PaginationOptions
{
    itemsPerPage: number;
    containerId: string;
    itemClass: string;
    paginationControlsId: string;
}

export class pagination{

    private itemsPerPage: number;
    private currentPage: number;
    private totalItems: number;
    private items: HTMLElement[];
   
    private paginationControls: HTMLElement;


    constructor(options: PaginationOptions)
    {
        this.itemsPerPage = options.itemsPerPage;
        this.currentPage = 1;
        
        this.paginationControls = document.getElementById(options.paginationControlsId)!;
        this.items = Array.from(document.getElementsByClassName(options.itemClass)) as HTMLElement[];
        this.totalItems = this.items.length;
        this.render();

    }

    private render()
    {
        this.showCurrentPage();
        this.renderPaginationControls();
    }

    private showCurrentPage()
    {
        this.items.forEach((item) => (item.style.display = `none`));

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = Math.min(startIndex + this.itemsPerPage, this.totalItems);

        for(let i = startIndex; i < endIndex; i++)
        {
            this.items[i].style.display = ``;
        }
    }

    private renderPaginationControls() {
        this.paginationControls.innerHTML = ``;  
      
        const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      
        const paginationList = document.createElement('ul');
        paginationList.classList.add('pagination-list');
      
        for (let i = 1; i <= totalPages; i++) {
          const listItem = document.createElement('li');
          const button = document.createElement('button');
          button.textContent = i.toString();
          button.classList.add('pagination-link');
          
          
          if (i === this.currentPage) {
            button.classList.add('is-current');
            button.style.backgroundColor = 'hsl(171, 100%, 41%)';
            button.style.color = 'black';
          }
      
          button.addEventListener('click', () => this.goToPage(i));
          listItem.appendChild(button);
          paginationList.appendChild(listItem);
        }
      
        
        this.paginationControls.appendChild(paginationList);
      }
      

    private goToPage(page: number)
    {
        this.currentPage = page;
        this.render();
    }

    public updateItems() {
        this.items = Array.from(document.getElementsByClassName('forecast-item')) as HTMLElement[];
        this.totalItems = this.items.length;
        this.currentPage = 1;
        this.render();
      }

}